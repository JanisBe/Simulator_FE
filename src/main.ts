import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { AppComponent } from './app/components/app.component';
import { AppRoutingModule } from './app/components/app-routing.module';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { getConfigProviders } from './app/services/config-factory';

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
