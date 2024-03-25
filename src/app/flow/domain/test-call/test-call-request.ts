import { IFlowViewModel } from '../i-flow-view-model';

export class TestCallRequest {

  constructor(
    public readonly flow: IFlowViewModel,
  ) {
  }
}
