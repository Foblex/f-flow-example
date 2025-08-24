import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {FlowState} from '@domain';
import {NgxsModule} from "@ngxs/store";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(NgxsModule.forRoot([FlowState])),
    provideAnimationsAsync()
  ]
};
