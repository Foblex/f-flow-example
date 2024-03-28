import { EFormBuilderControlType } from '../e-form-builder-control-type';
import { IEntitySummary } from '@foblex/ng-clarc';

export interface IFormBuilderValueControl<TValue = any> extends IEntitySummary<string> {

  type: EFormBuilderControlType;

  value?: TValue;
}
