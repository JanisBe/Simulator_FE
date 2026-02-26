import { Injectable, inject } from '@angular/core';
import { AppConfig } from '../models/models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SimulatorEngineConnectionService {
  private httpClient = inject(HttpClient);

  //config
  getApplicationConfiguration() {
    return this.httpClient.get<AppConfig>('./assets/configs/config.json');
  }
}
