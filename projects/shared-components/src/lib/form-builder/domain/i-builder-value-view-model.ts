import { FormGroup } from '@angular/forms';
import { IBuilderValueGroupViewModel } from './i-builder-value-group-view-model';

export interface IBuilderValueViewModel {

  groups: IBuilderValueGroupViewModel[];

  form: FormGroup;
}
