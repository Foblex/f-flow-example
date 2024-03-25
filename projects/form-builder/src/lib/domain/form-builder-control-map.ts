import { InputControlComponent } from '../controls/input/input-control.component';
import { TextareaControlComponent } from '../controls/textarea/textarea-control.component';
import { Type } from '@angular/core';
import { IMap } from '@infrastructure';
import { EFormBuilderControlType } from './e-form-builder-control-type';
import { OutputsSelectControlComponent } from '../controls/outputs-select/outputs-select-control.component';

export const FORM_BUILDER_CONTROL_MAP: IMap<Type<any>>  = {
  [ EFormBuilderControlType.INPUT ]: InputControlComponent,
  [ EFormBuilderControlType.OUTPUTS_SELECT ]: OutputsSelectControlComponent,
  [ EFormBuilderControlType.TEXTAREA ]: TextareaControlComponent,
};
