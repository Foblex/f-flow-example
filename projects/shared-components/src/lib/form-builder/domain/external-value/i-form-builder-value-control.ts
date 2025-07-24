import { EFormBuilderControlType } from '../e-form-builder-control-type';

export interface IFormBuilderValueControl<TValue = any> {

  key: string;
  name: string;

  type: EFormBuilderControlType;

  value?: TValue;
}
