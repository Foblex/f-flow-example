import { IKeyNameModel } from '@infrastructure';
import { EFormBuilderControlType } from '../e-form-builder-control-type';

export interface IFormBuilderValueControl<TValue = any> extends IKeyNameModel {

  type: EFormBuilderControlType;

  value?: TValue;
}
