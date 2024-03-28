import { ValueFromFormBuilderModelRequest } from './value-from-form-builder-model-request';
import { IFormBuilderValue } from '../external-value';
import { IHandler } from '@foblex/core';

export class ValueFromFormBuilderModelHandler implements IHandler<ValueFromFormBuilderModelRequest, IFormBuilderValue> {

  public handle(request: ValueFromFormBuilderModelRequest): IFormBuilderValue {
    return {
      groups: request.formBuilderValue.groups.map((x) => {
        return {
          name: x.name,
          controls: x.controls.map((y) => {
            return {
              key: y.key,
              name: y.name,
              type: y.type,
              value: y.formControl.value,
            }
          })
        };
      })
    };
  }
}
