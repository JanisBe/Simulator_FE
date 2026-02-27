import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { getConfigProviders } from './app/services/config-factory';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    importProvidersFrom(BrowserModule, AppRoutingModule),
    provideHttpClient(),
    getConfigProviders(),
    provideToastr({ maxOpened: 2 }),

  ],
}).catch(err => console.error(err));
