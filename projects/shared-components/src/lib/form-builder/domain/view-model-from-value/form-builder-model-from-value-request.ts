import { IFormBuilderValue } from '../external-value';

export class FormBuilderModelFromValueRequest {

    constructor(
      public value: IFormBuilderValue | null
    ) {
    }
}
