import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { GameConnexionService } from '../gameConnexion.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MockRealtimeService extends GameConnexionService {
  private supabase: SupabaseClient;
  private channel!: RealtimeChannel;
  sessionId: string = '';

  constructor() {
    super();
    // initialize your Supabase client (make sure to put these in environment vars)
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
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
  }

  disconnect(): void {
    if (this.channel) {
      this.supabase.removeChannel(this.channel);
    }
  }

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
