import { FormControl } from '@angular/forms';
import { IFormBuilderValueControl } from './external-value';

export interface IBuilderValueControlViewModel<TValue = any> extends IFormBuilderValueControl<TValue> {

  formControl: FormControl;
}
