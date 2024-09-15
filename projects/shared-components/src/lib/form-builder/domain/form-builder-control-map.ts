import { InputControlComponent } from '../controls/input/input-control.component';
import { TextareaControlComponent } from '../controls/textarea/textarea-control.component';
import { Type } from '@angular/core';
import { OutputsSelectControlComponent } from '../controls/outputs-select/outputs-select-control.component';
import { EFormBuilderControlType } from './e-form-builder-control-type';
import { IMap } from './i-map';

export const FORM_BUILDER_CONTROL_MAP: IMap<Type<any>>  = {
  [ EFormBuilderControlType.INPUT ]: InputControlComponent,
  [ EFormBuilderControlType.OUTPUTS_SELECT ]: OutputsSelectControlComponent,
  [ EFormBuilderControlType.TEXTAREA ]: TextareaControlComponent,
};
