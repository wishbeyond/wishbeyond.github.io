import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/interceptors/auth-interceptor.service';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { credentialsInterceptor } from './app/interceptors/credentials-interceptor.service';
import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from './app/auth.service';
import { firstValueFrom } from 'rxjs';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, credentialsInterceptor])),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER, 
      useFactory: (s: AuthService) => initAuth(s),
      multi: true, 
      deps: [AuthService],
    },
  ],
}).catch(err => console.error(err));

function initAuth(authService: AuthService) {
  return () => firstValueFrom(authService.checkAuth())
}
