export class BulkRemoveItemsAction {

  public static readonly type = '[Flow] Bulk Remove Items';

  constructor(
    public flowKey: string,
    public nodeKeys: string[],
    public outputKeys: string[]
  ) {

  }
}
