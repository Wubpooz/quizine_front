import { Injectable } from '@angular/core';
import { GameConnexionService } from "../gameConnexion.service";
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RealtimeService extends GameConnexionService {
  sessionId: string = "";
  private supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  private activeChannels = new Map<string, RealtimeChannel>();

  connect(): void {
    // Optional: you could initialize auth or other Supabase client config here
  }

  disconnect(): void {
    this.activeChannels.forEach(channel => this.supabase.removeChannel(channel));
    this.activeChannels.clear();
  }

  listenGameStart(callback: (data: any) => void): void {
    if (!this.sessionId) return;

    const id = `session:${this.sessionId}`;
    if (this.activeChannels.has(id)) return;

    const channel = this.supabase
      .channel(id)
      .on('postgres_changes', {
        schema: 'public',
        table: 'sessions',
        event: 'UPDATE',
        filter: `id=eq.${this.sessionId}`
      }, payload => callback(payload.new))
      .subscribe();

    this.activeChannels.set(id, channel);
  }

  listenLeaderboard(callback: (data: any) => void): void {
    if (!this.sessionId) return;

    const id = `leaderboard:${this.sessionId}`;
    if (this.activeChannels.has(id)) return;

    const channel = this.supabase
      .channel(id)
      .on('postgres_changes', {
        schema: 'public',
        table: 'participations',
        event: '*',
        filter: `session_id=eq.${this.sessionId}`
      }, payload => callback(payload.new))
      .subscribe();

    this.activeChannels.set(id, channel);
  }

  emitJoin(creator: boolean, sessionId: string, userId: string): void {
    console.warn("emitJoin not supported in Supabase Realtime");
  }

  emitRefuse(sessionId: string, userId: string): void {
    console.warn("emitRefuse not supported in Supabase Realtime");
  }

  emitLeaveRoom(sessionId: string, userId: string): void {
    console.warn("emitLeaveRoom not supported in Supabase Realtime");
  }

  emitScore(score: number, sessionId: string, userId: string): void {
    console.warn("emitScore not supported in Supabase Realtime");
  }
}
