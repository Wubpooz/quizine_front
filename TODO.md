# TODO

## P1
- [ ] Release plan
- [ ] add OAuth Google
- [ ] remove all nulls
- [ ] notifs
- [x] probes
- [x] keep alive redis
- [ ] switch to supabase realtime for websockets
- [ ] tests in CI/CD
- [ ] ChatGPT integration


&nbsp;  
&nbsp;  
## Supabase realtime instead of socket.io
Enable RLS : 
```sql
-- Enable RLS
ALTER TABLE public.game_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "game_request: parties only"
  ON public.game_request FOR SELECT
  USING (id_requestor = auth.uid() OR id_validator = auth.uid());

CREATE POLICY "participation: own only"
  ON public.participation FOR SELECT
  USING (id_user = auth.uid());

CREATE POLICY "session: participant only"
  ON public.session FOR SELECT
  USING (
    id_creator = auth.uid() OR
    id IN (SELECT id_session FROM public.participation WHERE id_user = auth.uid())
  );
```


data handling in backend : 
```ts
/*
 * Filename: src/controllers/game.controller.ts
 * Description: This file replaces the old socket logic. All real-time event logic
 * is now handled by secure REST endpoints that modify the database.
 * Supabase Realtime will broadcast the resulting database changes to the clients.
 */
import { Request, Response } from 'express';
// Assuming you have these model functions from your existing setup
import { 
    createParticipation, 
    deleteParticipation,
    setScoreBis 
} from "../models/Participation";
import { deleteGameRequestBis, findGameRequestAsSession } from "../models/GameRequest";
import { findSessionById, updateSessionStatus } from "../models/Session";
import { findQuizById } from "../models/Quiz";
import { findUserById } from "../models/User";

// You no longer need getIO or any socket.io related imports.

/**
 * Controller to handle a user joining a game session.
 * This is called when a user accepts a game invite.
 * Replaces the 'eventJoin' socket event.
 */
export const joinSession = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const userId = req.user?.id; // Assuming user is attached from a session/auth middleware

    if (!userId) {
        return res.status(401).json({ error: "Authentication required." });
    }

    try {
        // 1. Delete the game request for this user
        await deleteGameRequestBis(sessionId, userId);

        // 2. Create a participation record
        await createParticipation(sessionId, userId);
        
        // 3. Check if the game is ready to start
        const remainingRequests = await findGameRequestAsSession(sessionId);
        
        if (!remainingRequests || remainingRequests.length === 0) {
            // All players have joined. Update the session status to 'started'.
            // This database UPDATE is the event that clients will receive.
            await updateSessionStatus(sessionId, 'started');
            console.log(`[Game] Session ${sessionId} started.`);
        }

        res.status(200).json({ message: "Successfully joined session." });

    } catch (error) {
        console.error(`Error joining session ${sessionId} for user ${userId}:`, error);
        res.status(500).json({ error: "Failed to join session." });
    }
};

/**
 * Controller for when a user (player or organizer) leaves a session before it ends.
 * Replaces the 'eventLeave' socket event.
 */
export const leaveSession = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Authentication required." });
    }

    try {
        await deleteParticipation(sessionId, userId);
        console.log(`[Game] User ${userId} left session ${sessionId}.`);
        
        // Optional: You could broadcast this leave event by updating the session or
        // letting the DELETE on 'participations' table be the event.
        // For simplicity, the DELETE operation is the event.

        res.status(200).json({ message: "Successfully left session." });
    } catch (error) {
        console.error(`Error leaving session ${sessionId} for user ${userId}:`, error);
        res.status(500).json({ error: "Failed to leave session." });
    }
};

/**
 * Controller for when a user refuses a game invite.
 * Replaces the 'eventRefuse' socket event.
 */
export const refuseInvite = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Authentication required." });
    }
    
    try {
        await deleteGameRequestBis(sessionId, userId);
        console.log(`[Game] User ${userId} refused invite for session ${sessionId}.`);

        // Check if this refusal means the game can start for remaining players
        const remainingRequests = await findGameRequestAsSession(sessionId);
        if (!remainingRequests || remainingRequests.length === 0) {
            await updateSessionStatus(sessionId, 'started');
            console.log(`[Game] Session ${sessionId} started after refusal.`);
        }

        res.status(200).json({ message: "Invite refused." });
    } catch (error) {
        console.error(`Error refusing invite for session ${sessionId} for user ${userId}:`, error);
        res.status(500).json({ error: "Failed to refuse invite." });
    }
};


/**
 * Controller for a user submitting their score.
 * Replaces the 'sendScore' socket event.
 */
export const submitScore = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { score } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Authentication required." });
    }
    if (typeof score !== 'number') {
        return res.status(400).json({ error: "Score must be a number." });
    }

    try {
        // This UPDATE on the participations table will be broadcasted to clients
        // who can then update the live leaderboard.
        await setScoreBis(sessionId, userId, score);
        res.status(200).json({ message: "Score submitted successfully." });
    } catch (error) {
        console.error(`Error submitting score for session ${sessionId} for user ${userId}:`, error);
        res.status(500).json({ error: "Failed to submit score." });
    }
};

/*
 * ==============================================================================
 * IMPORTANT: You must add these new routes to your Express router.
 * e.g., in your game.routes.ts file:
 *
 * router.post('/game/session/:sessionId/join', authMiddleware, joinSession);
 * router.post('/game/session/:sessionId/leave', authMiddleware, leaveSession);
 * router.post('/game/session/:sessionId/refuse', authMiddleware, refuseInvite);
 * router.post('/game/session/:sessionId/score', authMiddleware, submitScore);
 * ==============================================================================
 */
```



realtime.service.ts :
```ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private supabase: SupabaseClient;
  private channels: Record<string, RealtimeChannel> = {};

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  subscribeSession(
    sessionId: string,
    onJoin: (newRow: any) => void,
    onScore: (updatedRow: any) => void
  ) {
    const channel = this.supabase
      .channel(`public:participation:session_id_eq.${sessionId}`)
      .on(
        'postgres_changes',
        { schema: 'public', table: 'participation', event: 'INSERT', filter: `id_session=eq.${sessionId}` },
        ({ new: newRow }) => onJoin(newRow)
      )
      .on(
        'postgres_changes',
        { schema: 'public', table: 'participation', event: 'UPDATE', filter: `id_session=eq.${sessionId}` },
        ({ new: updatedRow }) => onScore(updatedRow)
      )
      .subscribe();

    this.channels[sessionId] = channel;
  }

  unsubscribeSession(sessionId: string) {
    const ch = this.channels[sessionId];
    if (ch) {
      this.supabase.removeChannel(ch);
      delete this.channels[sessionId];
    }
  }
}

=================
// in waiting page component : 

export class WaitingPageComponent implements OnInit, OnDestroy {
  constructor(
    private realtime: RealtimeService,
    private api: APIService
  ) {}

  ngOnInit() {
    this.realtime.subscribeSession(
      this.sessionId,
      newRow => this.handleNewParticipation(newRow),
      updatedRow => this.handleScoreUpdate(updatedRow)
    );

    // still emit via HTTP
    this.api.joinSession(this.sessionId).subscribe();
  }

  ngOnDestroy() {
    this.realtime.unsubscribeSession(this.sessionId);
  }
}
```


#### Other version :
```ts
/*
 * Filename: src/app/services/supabase.service.ts
 * Description: New service to manage the Supabase client and Realtime subscriptions.
 * This replaces SocketService.
 */
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { environment } from '../../environments/environment'; // Assuming you have your Supabase URL/key here

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private activeChannels: Map<string, RealtimeChannel> = new Map();

  constructor() {
    // Initialize the Supabase client.
    // Ensure you have SUPABASE_URL and SUPABASE_KEY in your environment files.
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    console.log('SupabaseService initialized.');
  }

  /**
   * Subscribes to all changes on the 'sessions' table for a specific session_id.
   * This is used to listen for when the game starts (i.e., when session.status changes).
   * @param sessionId The ID of the session to listen to.
   * @param callback The function to execute when a change is received.
   * @returns The RealtimeChannel instance.
   */
  public onSessionUpdate(sessionId: string, callback: (payload: any) => void): RealtimeChannel {
    const channelId = `session:${sessionId}`;
    if (this.activeChannels.has(channelId)) {
        return this.activeChannels.get(channelId)!;
    }

    const channel = this.supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions', // Make sure this is your sessions table name
          filter: `id=eq.${sessionId}`,
        },
        payload => {
          console.log('[Supabase] Session update received:', payload);
          callback(payload);
        }
      )
      .subscribe(status => {
          if (status === 'SUBSCRIBED') {
              console.log(`[Supabase] Successfully subscribed to session ${sessionId}`);
          }
      });

    this.activeChannels.set(channelId, channel);
    return channel;
  }

  /**
   * Subscribes to changes in the 'participations' table for a given session.
   * Used to update the leaderboard in real-time as players submit scores.
   * @param sessionId The ID of the session to listen to.
   * @param callback The function to execute on new data.
   * @returns The RealtimeChannel instance.
   */
  public onLeaderboardUpdate(sessionId: string, callback: (payload: any) => void): RealtimeChannel {
    const channelId = `leaderboard:${sessionId}`;
    if (this.activeChannels.has(channelId)) {
        return this.activeChannels.get(channelId)!;
    }

    const channel = this.supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'participations', // Your participations table
          filter: `session_id=eq.${sessionId}`,
        },
        payload => {
            console.log('[Supabase] Leaderboard update received:', payload);
            // You might want to re-fetch the full leaderboard from your API here
            // to get all participant data, or just use the payload directly.
            callback(payload);
        }
      )
      .subscribe();
      
    this.activeChannels.set(channelId, channel);
    return channel;
  }

  /**
   * Unsubscribes from a specific channel to prevent memory leaks.
   * @param channel The channel to unsubscribe from.
   */
  public unsubscribe(channel: RealtimeChannel) {
    if (channel) {
        console.log(`[Supabase] Unsubscribing from channel ${channel.topic}`);
        this.supabase.removeChannel(channel);
        this.activeChannels.delete(channel.topic);
    }
  }

  /**
   * Unsubscribes from all active channels.
   * Call this on a global logout event.
   */
  public unsubscribeAll() {
    this.activeChannels.forEach(channel => {
        this.unsubscribe(channel);
    });
    console.log('[Supabase] Unsubscribed from all channels.');
  }
}

==============================================

/*
 * Filename: src/app/services/api.service.ts
 * Description: Updated API service to call the new backend endpoints.
 * The original methods are kept, and new methods are added to replace socket emits.
 */
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
// ... other imports (User, Quiz, ToastrService, etc.)

@Injectable({
  providedIn: 'root'
})
export class APIService {
    // ... (constructor, endpoint, NOTIF_STYLE, handleError, and all existing methods remain unchanged)

    //======================================================================
    //=========== NEW METHODS TO REPLACE SOCKET.IO EMITS ===================
    //======================================================================

    /**
     * Tell the backend the current user is joining a session.
     * @param sessionId The ID of the session to join.
     */
    joinSession(sessionId: string): Observable<any> {
        return this.http.post(`${this.endpoint}/game/session/${sessionId}/join`, {}, { withCredentials: true }).pipe(
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Tell the backend the current user is leaving a session.
     * @param sessionId The ID of the session to leave.
     */
    leaveSession(sessionId: string): Observable<any> {
        return this.http.post(`${this.endpoint}/game/session/${sessionId}/leave`, {}, { withCredentials: true }).pipe(
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Tell the backend the current user is refusing an invite.
     * @param sessionId The ID of the session associated with the invite.
     */
    refuseInvite(sessionId: string): Observable<any> {
        return this.http.post(`${this.endpoint}/game/session/${sessionId}/refuse`, {}, { withCredentials: true }).pipe(
            catchError(error => this.handleError(error))
        );
    }
    
    /**
     * Send the user's score to the backend.
     * @param sessionId The ID of the current session.
     * @param score The user's calculated score.
     */
    sendScore(sessionId: string, score: number): Observable<any> {
        return this.http.post(`${this.endpoint}/game/session/${sessionId}/score`, { score }, { withCredentials: true }).pipe(
            catchError(error => this.handleError(error))
        );
    }

    // Keep all your other methods like login, signup, createQuiz, etc. They are still needed.
    // ...
}

============================================================

/*
 * Filename: src/app/components/waiting-page/waiting-page.component.ts
 * Description: Refactored component to use SupabaseService instead of SocketService.
 */
import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RealtimeChannel } from '@supabase/supabase-js';
import { APIService } from '../../services/api.service';
import { SupabaseService } from '../../services/supabase.service'; // Import new service

@Component({
  selector: 'waiting-page',
  // ... other component metadata
})
export class WaitingPageComponent implements OnInit, OnDestroy {
  @Input() isCreator!: boolean;
  @Input() sessionId!: string;
  @Input() refus?: boolean;
  @Output() close = new EventEmitter<void>();

  timer: number = 60;
  private intervalId: any;
  private sessionChannel: RealtimeChannel | undefined;

  constructor(
    private router: Router,
    private apiService: APIService,
    private supabaseService: SupabaseService // Inject new service
  ) {}

  ngOnInit() {
    this.startCountdown();

    if (this.refus) {
      this.apiService.refuseInvite(this.sessionId).subscribe({
        next: () => console.log('Invite refused.'),
        error: (err) => console.error('Error refusing invite:', err)
      });
      this.close.emit();
      return;
    }
    
    // If not the creator, explicitly call the join endpoint.
    // The creator is considered to have joined when they create the session.
    if (!this.isCreator) {
        this.apiService.joinSession(this.sessionId).subscribe({
            next: () => console.log('Successfully called join endpoint.'),
            error: (err) => console.error('Error joining session:', err)
        });
    }

    // Subscribe to session updates to know when the game starts.
    this.sessionChannel = this.supabaseService.onSessionUpdate(this.sessionId, (payload) => {
      // The backend will update the session's status to 'started'.
      if (payload.new?.status === 'started') {
        console.log('Game start signal received!');
        this.playQuiz();
      }
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.sessionChannel) {
      this.supabaseService.unsubscribe(this.sessionChannel);
    }
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.timer -= 1;
      if (this.timer <= 0) {
        this.playQuiz(); // Fallback if start signal isn't received in time
      }
    }, 1000);
  }

  playQuiz() {
    clearInterval(this.intervalId);
    // Navigate to the quiz page.
    this.router.navigate(['/quiz-question'], { queryParams: { session: this.sessionId } });
    this.close.emit(); // Close the waiting modal
  }

  onClose() {
    this.close.emit();
    // Instead of deleting participation, we now call the leave endpoint
    this.apiService.leaveSession(this.sessionId).subscribe({
        next: () => console.log('Left session.'),
        error: (err) => console.error('Error leaving session:', err)
    });
  }

  formatTimer(seconds: number): string {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }
}


======================================================

/*
 * Filename: src/app/components/user-invite/user-invite.component.ts
 * Description: Refactored to remove socket connection. The logic is now purely API-driven.
 */
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/userModel';
import { AppStore } from '../../stores/app.store';
import { APIService } from '../../services/api.service';
// No longer need SocketService

@Component({
  selector: 'user-invite',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-invite.component.html'
})
export class UserInviteComponent implements OnInit {
  @Input() quizId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string>();
  
  friends: User[] = [];
  selectedFriends: string[] = [];
  sessionId!: string;

  constructor(private appStore: AppStore, private apiservice: APIService) {}
      
  async ngOnInit(): Promise<void> {
    this.apiservice.getAllUsers().subscribe((friends: User[] | undefined) => {
      this.friends = friends?.filter(friend => friend.id !== this.appStore.currentUser.value?.id) || [];
    });

    // Sockets are no longer needed here. We just create the session via the API.
    this.apiservice.createSession(this.quizId).subscribe((sessionId: string) => {
      this.sessionId = sessionId;
      console.log("Created session:", sessionId);
    });
  }

  // ngOnDestroy is no longer needed for socket disconnection.

  onCheckboxChange(event: any, id: string) {
    if (event.target.checked) {
      this.selectedFriends.push(id);
    } else {
      this.selectedFriends = this.selectedFriends.filter(fid => fid !== id);
    }
  }

  onSubmit() {
    if (this.selectedFriends.length > 0) {
      console.log('Inviting:', this.selectedFriends);
      this.apiservice.requestGame(this.sessionId, this.selectedFriends).subscribe((payload) => {
        console.log("Invitation sent:", payload);
      });
    }
    this.submit.emit(this.sessionId);
  }

  onSkip() {
    this.submit.emit(this.sessionId);
  }

  onClose() {
    this.close.emit();
    if (this.sessionId) {
      this.apiservice.deleteParticipation(this.sessionId).subscribe((payload) => {
        console.log("Deleted participation:", payload);
      });
    }
  }
}
```


To-Do List:
- Environment Variables: Make sure your Angular environment.ts file contains your Supabase URL and Anon Key.  
- Supabase Setup: In your Supabase project dashboard, go to Database -> Replication and ensure that replication is enabled for your sessions and participations tables.  
- Database Models: You may need to add the updateSessionStatus function to your Session model on the backend. It would simply be an UPDATE SQL query.  
- Install Supabase Client: Run npm install @supabase/supabase-js in your Angular project.  
- Remove Socket.io Client: Run npm uninstall socket.io-client.  
- Backend Cleanup: Remove socket.io from your package.json on the backend and delete the io.ts and gameSocket.ts files. Update your main server file to no longer initialize the socket server.  





RLS ensures each user only sees relevant rows over Realtime.  

Supabase anon key in frontend + JWT session cookie (withCredentials) ensures the Realtime client is authenticated.  








&nbsp;  
&nbsp;  
## Tests in CI/CD

Security flaws linter :
`npm install eslint-plugin-security --save-dev`


.eslintrc : 
```json
{
  "plugins": ["security"],
  "extends": ["plugin:security/recommended"]
}
```


| Test                          | Tool               | Easy to add? | Where    |
| ----------------------------- | ------------------ | ------------ | -------- |
| Vulnerability scan            | `npm audit` / Snyk | ✅            | CI       |
| Lint for security             | ESLint plugin      | ✅            | CI       |
| Static tests for auth & input | Jest/Karma         | ✅            | Codebase |
| Dynamic scan                  | ZAP                | ⚡️           | Staging  |






/.github/workflows/ci.yml :

```yml
name: Frontend CI/CD

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  test-and-scan:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      # Install & Test
      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test -- --watch=false --browsers=ChromeHeadless

      # Security: Dependency Audit
      - name: Audit dependencies
        run: npm audit --audit-level=high

      # Security: ESLint (with plugin:security)
      - name: Lint for security
        run: npm run lint

  deploy:
    needs: test-and-scan
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Confirm Vercel auto-deploy
        run: echo "Vercel will pick up the push and deploy automatically."
```


AND  


```yml
name: Backend CI/CD

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  test-and-scan:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      # Install & Test
      - name: Install dependencies
        run: npm ci

      - name: Compile TypeScript
        run: npm run build

      - name: Run unit tests
        run: npm run test

      # Security: Dependency Audit
      - name: Audit dependencies
        run: npm audit --audit-level=high

      # Security: ESLint (with plugin:security)
      - name: Lint for security
        run: npm run lint

      # Optional: Dynamic Scan in Staging
      - name: OWASP ZAP Baseline Scan
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        uses: zaproxy/action-baseline@v0.10.0
        with:
          target: ${{ secrets.STAGING_URL }}

  deploy:
    needs: test-and-scan
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Confirm Vercel auto-deploy
        run: echo "Vercel backend deployment has been triggered."
```

+ Karma/Jasmine front and Jest/mocha back tests


