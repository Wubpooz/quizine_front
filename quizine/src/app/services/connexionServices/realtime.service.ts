import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { GameConnexionService } from '../gameConnexion.service';
import { environment } from '../../../environments/environment';
import { GameSessionStore } from '../../stores/gameSession.store';

@Injectable({ providedIn: 'root' })
export class RealtimeService extends GameConnexionService {
  private supabase: SupabaseClient;
  private channel!: RealtimeChannel;
  sessionId: string = '';

  constructor(private gameSessionStore: GameSessionStore) {
    super();
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }});

    this.gameSessionStore.sessionId.subscribe((sessionId) => {
      if(sessionId != undefined) {
        this.sessionId = sessionId;
      }
    });
  }

  connect(): void {
    if(!this.sessionId) {
      console.error('Cannot connect: sessionId is not set.');
      return;
    }

    // Create (or reuse) a channel scoped to this session
    this.channel = this.supabase
      .channel(`game-session-${this.sessionId}`)
      .on('broadcast', { event: 'gamestart' }, payload => {
        // listenGameStart will hook in later
      })
      .on('broadcast', { event: 'leaderboard' }, payload => {
        // listenLeaderboard will hook in later
      })
      .on('broadcast', { event: 'join' }, payload => this._emitFallback('join', payload))
      .on('broadcast', { event: 'joinOrganiser' }, payload => this._emitFallback('joinOrganiser', payload))
      .on('broadcast', { event: 'refuse' }, payload => this._emitFallback('refuse', payload))
      .on('broadcast', { event: 'leave' }, payload => this._emitFallback('leave', payload))
      .on('broadcast', { event: 'score' }, payload => this._emitFallback('score', payload))
      .subscribe();

    console.log(`Connected on game-session-${this.sessionId} channel.`);
  }

  disconnect(): void {
    if (this.channel) {
      this.supabase.removeChannel(this.channel);
    }
  }

  //TODO add api service calls
  listenGameStart(callback: (data: any) => void): void {
    this.channel.on('broadcast', { event: 'gamestart' }, ({ payload }) => {
      callback(payload);
    });
  }

  listenLeaderboard(callback: (data: any) => void): void {
    this.channel.on('broadcast', { event: 'leaderboard' }, ({ payload }) => {
      callback(payload);
    });
  }

  emitJoin(creator: boolean, sessionId: string, userId: string): void {
    this._ensureSession(sessionId);
    const event = creator ? 'joinOrganiser' : 'join';
    this.channel.send({
      type: 'broadcast',
      event,
      payload: { sessionId, userId }
    });
    this.gameSessionStore.invitedUsers.next(this.gameSessionStore.invitedUsers.value.filter(user => user.id !== userId)); // remove self from invited users
  }

  emitRefuse(sessionId: string, userId: string): void {
    this._ensureSession(sessionId);
    this.channel.send({
      type: 'broadcast',
      event: 'refuse',
      payload: { sessionId, userId }
    });
  }

  emitLeaveRoom(sessionId: string, userId: string): void {
    this._ensureSession(sessionId);
    this.channel.send({
      type: 'broadcast',
      event: 'leave',
      payload: { sessionId, userId }
    });
  }

  emitScore(score: number, sessionId: string, userId: string): void {
    this._ensureSession(sessionId);
    this.channel.send({
      type: 'broadcast',
      event: 'score',
      payload: { sessionId, userId, score }
    });
  }

  private _ensureSession(sessionId: string) {
    if(!this.sessionId || this.sessionId === '') {
      this.sessionId = sessionId;
      this.connect();
    }
    else if(this.sessionId !== sessionId) {
      // if switching sessions, tear down old channel
      this.disconnect();
      this.sessionId = sessionId;
      this.connect();
    }
  }

  /**
   * Fallback generic emitter for any event you want to catch
   * E.g. if you ever need to log or handle custom events centrally.
   */
  private _emitFallback(eventName: string, payload: any) {
    console.log(`[Supabase] received ${eventName}:`, payload);
  }
}


/*
import { Injectable } from '@angular/core';
import { SupabaseClient, createClient, PostgrestSingleResponse } from '@supabase/supabase-js';
import { GameConnexionService } from '../gameConnexion.service';
import { APIService } from '../api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService extends GameConnexionService {
  sessionId: string = '';
  private supabase: SupabaseClient;

  constructor(private api: APIService) {
    super();
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  connect(): void {
    // no-op, optional if channel already handled on demand
  }

  disconnect(): void {
    this.supabase.removeAllChannels();
  }

  listenGameStart(callback: (data: any) => void): void {
    this.supabase
      .channel('game-session-status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${this.sessionId}`
        },
        payload => {
          if (payload.new.status === 'started') {
            callback(payload.new);
          }
        }
      )
      .subscribe();
  }

  listenLeaderboard(callback: (data: any) => void): void {
    this.supabase
      .channel('game-leaderboard')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'participations',
          filter: `session_id=eq.${this.sessionId}`
        },
        payload => {
          callback(payload.new); // score updates
        }
      )
      .subscribe();
  }

  emitJoin(creator: boolean, sessionId: string, userId: string): void {
    this.sessionId = sessionId;
    this.api.joinSession(sessionId).subscribe({
      next: () => console.log(`[Realtime] Joined session ${sessionId}`),
      error: err => console.error(`[Realtime] Failed to join session:`, err)
    });
  }

  emitRefuse(sessionId: string, userId: string): void {
    this.api.refuseInvite(sessionId).subscribe({
      next: () => console.log(`[Realtime] Refused invite for session ${sessionId}`),
      error: err => console.error(`[Realtime] Failed to refuse invite:`, err)
    });
  }

  emitLeaveRoom(sessionId: string, userId: string): void {
    this.api.leaveSession(sessionId).subscribe({
      next: () => console.log(`[Realtime] Left session ${sessionId}`),
      error: err => console.error(`[Realtime] Failed to leave session:`, err)
    });
  }

  emitScore(score: number, sessionId: string, userId: string): void {
    this.api.sendScore(sessionId, score).subscribe({
      next: () => console.log(`[Realtime] Score ${score} submitted for session ${sessionId}`),
      error: err => console.error(`[Realtime] Failed to send score:`, err)
    });
  }
}
*/