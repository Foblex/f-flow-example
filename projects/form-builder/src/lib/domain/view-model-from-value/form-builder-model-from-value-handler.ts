import { FormBuilderModelFromValueRequest } from './form-builder-model-from-value-request';
import { IHandler } from '@infrastructure';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilderModelFromValueResponse } from './form-builder-model-from-value-response';
import { IBuilderValueControlViewModel } from '../i-builder-value-control-view-model';
import { IBuilderValueGroupViewModel } from '../i-builder-value-group-view-model';
import { IFormBuilderValueControl } from '../external-value';

export class FormBuilderModelFromValueHandler implements IHandler<FormBuilderModelFromValueRequest, FormBuilderModelFromValueResponse> {

  public handle(request: FormBuilderModelFromValueRequest): FormBuilderModelFromValueResponse {
    const form = new FormGroup({});

    const groups: IBuilderValueGroupViewModel[] = [];

    (request.value?.groups || []).forEach((x) => {

      const controls = this.mapControlModelToFormControl(x.controls, form);
      const group: IBuilderValueGroupViewModel = { ...x, controls };
      groups.push(group);
    });

    const result = new FormBuilderModelFromValueResponse(groups, form);

    return result;
  }

  private mapControlModelToFormControl(controls: IFormBuilderValueControl[], form: FormGroup): IBuilderValueControlViewModel[] {
    const result = controls.map((controlModel) => {
      const formControl = new FormControl(controlModel.value);
      form.addControl(controlModel.key, formControl);
      return {
        ...controlModel,
        formControl
      }
    });

    return result;
  }
}
