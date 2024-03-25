export class CreateFlowAction {

  public static readonly type = '[Flow] Create';
  constructor(public key: string, public name: string) {

  }
}
