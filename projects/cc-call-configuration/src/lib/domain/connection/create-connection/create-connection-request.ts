import { IFlowViewModel } from '../../i-flow-view-model';

export class CreateConnectionRequest {

  constructor(
    public readonly flow: IFlowViewModel,
    public readonly outputKey: string,
    public readonly inputKey: string
  ) {
  }
}
