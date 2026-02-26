import { APP_INITIALIZER } from '@angular/core';
import { ConfigService } from './config.service';

function requestConfig(configService: ConfigService) {
  return configService.reguestConfig();
}

export function getConfigProviders() {
  return [
    {
      provide: APP_INITIALIZER,
      useFactory: requestConfig,
      multi: true,
      deps: [ConfigService],
    },
  ];
}
