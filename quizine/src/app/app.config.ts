import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { APIService } from './services/api.service';
import { MockAPIService } from './services/mock-api.service';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APIService,
      useClass: environment.mockAuth ? MockAPIService : APIService
    },
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr()
  ]
};
