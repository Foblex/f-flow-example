import { IBuilderValueViewModel } from '../i-builder-value-view-model';
import { IBuilderValueGroupViewModel } from '../i-builder-value-group-view-model';
import { FormGroup } from '@angular/forms';

export class FormBuilderModelFromValueResponse implements IBuilderValueViewModel {

  constructor(
    public groups: IBuilderValueGroupViewModel[],
    public form: FormGroup
  ) {
  }
}
