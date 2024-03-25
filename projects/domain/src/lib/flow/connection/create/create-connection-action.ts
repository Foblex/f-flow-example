export class CreateConnectionAction {

  public static readonly type = '[Flow] Create Connection';

  constructor(
    public flowKey: string,
    public outputNodeKey: string,
    public outputKey: string,
    public inputKey: string
  ) {

  }
}
