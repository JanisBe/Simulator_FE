import { Injectable, inject } from '@angular/core';
import { SimulatorEngineConnectionService } from '../services/simulator-engine-connection.service';
import { tap } from 'rxjs';
import { AppConfig, Hint, Template } from '../models/models';
import { EnviromentAvaliableDistributors } from '../models/fix-models';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _distributors: EnviromentAvaliableDistributors[] = [];
  private _environments: string[] = [];
  private _providers: string[] = [];
  private _tbkdTemplates: Template[] = [];
  private _ecniTemplates: Template[] = [];
  private _merrTemplates: Template[] = [];
  private _oinpTemplates: Template[] = [];
  private _hints: Hint[] = [];
  private _baseUrl = '';
  //private _webSocketbaseUrl =  '';
  private _stompWebSocketBaseurl = '';
  private simulatorEngineConnectionService = inject(SimulatorEngineConnectionService);

  requestConfig() {
    return () =>
      this.simulatorEngineConnectionService
        .getApplicationConfiguration()
        .pipe(tap(res => this.mapConfig(res)));
  }

  mapConfig(config: AppConfig) {
    this._distributors = config?.distributors ?? [];
    this._environments = config?.environments ?? [];
    this._providers = config?.providers ?? [];
    this._tbkdTemplates = config?.tbkdTemplates ?? [];
    this._merrTemplates = config?.merrTemplates ?? [];
    this._oinpTemplates = config?.oinpTemplates ?? [];
    this._ecniTemplates = config?.ecniTemplates ?? [];
    this._hints = config?.hints ?? [];
    this._stompWebSocketBaseurl = config?.stompWebSocketBaseurl ?? '';
  }

  get distributors() {
    return this._distributors;
  }

  get environments() {
    return this._environments;
  }

  get providers() {
    return this._providers;
  }

  get tbkdTemplates() {
    return this._tbkdTemplates;
  }

  get ecniTemplates() {
    return this._ecniTemplates;
  }

  get merrTemplates() {
    return this._merrTemplates;
  }

  get oinpTemplates() {
    return this._oinpTemplates;
  }

  get stompWebSocketBaseurl() {
    return this._stompWebSocketBaseurl;
  }

  getHint(
    field:
      | 'GatewayType'
      | 'TBKDTemplate'
      | 'ECNITemplate'
      | 'ErrorFrequency'
      | 'MERRTemplate'
      | 'Interval'
      | 'MesageCount',
  ) {
    return this._hints.find(hint => hint.fieldName === field)?.hint ?? '';
  }
}
