import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { APIService } from './services/api.service';
import { MockAPIService } from './services/mock-api.service';
import { environment } from '../environments/environment';
import { SocketService } from './services/socket.service';
import { MockSocketService } from './services/mock-socket.service';

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
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr()
  ]
};
