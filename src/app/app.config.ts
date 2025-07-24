import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FlowState } from '@domain';
import {NgxsModule} from "@ngxs/store";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(NgxsModule.forRoot([FlowState])),
    provideRouter(routes),
    provideAnimationsAsync()
  ]
};
