import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { App } from './app/app';
import { AppRoutingModule } from './app/app-routing.module';
import { tokenInterceptor } from './app/services/token.interceptor';

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(AppRoutingModule, FormsModule),
    provideHttpClient(withInterceptors([tokenInterceptor]))
  ]
}).catch(err => console.error(err));
