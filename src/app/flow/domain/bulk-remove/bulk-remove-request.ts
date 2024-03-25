import { IFlowViewModel } from '../i-flow-view-model';

export class BulkRemoveRequest {

  constructor(
    public readonly flow: IFlowViewModel,
    public readonly nodeKeys: string[],
    public readonly connectionKeys: string[]
  ) {
  }
}
