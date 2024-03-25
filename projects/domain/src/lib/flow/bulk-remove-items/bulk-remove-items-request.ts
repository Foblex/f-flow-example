import { IFlowModel } from '../i-flow-model';

export class BulkRemoveItemsRequest {

  constructor(
    public flowKey: string,
    public nodeKeys: string[],
    public outputKeys: string[],
    public flows: IFlowModel[]
  ) {
  }
}
