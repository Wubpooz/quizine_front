import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { APIService } from './services/api.service';
import { MockAPIService } from './services/mocks/mock-api.service';
import { environment } from '../environments/environment';
import { SocketService } from './services/connexionServices/socket.service';
import { MockSocketService } from './services/mocks/mock-socket.service';
import { RealtimeService } from './services/connexionServices/realtime.service';
import { MockRealtimeService } from './services/mocks/mock-realtime.service';
import { GameConnexionService } from './services/gameConnexion.service';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APIService,
      useClass: environment.mockAuth ? MockAPIService : APIService
    },
    {
      provide: SocketService,
      useClass: environment.mockAuth ? MockSocketService : SocketService
    },
    {
      provide: RealtimeService,
      useClass: environment.mockAuth ? MockRealtimeService : RealtimeService
    },
    {
      provide: GameConnexionService,
      useClass: environment.socket ? SocketService : RealtimeService
    },
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr()
  ]
};
