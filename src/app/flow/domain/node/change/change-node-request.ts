import { IFlowViewModel } from '../../i-flow-view-model';
import { INodeValueModel } from '@domain';
import { INodeViewModel } from '../../i-node-view-model';

export class ChangeNodeRequest {

  constructor(
    public readonly flow: IFlowViewModel,
    public readonly node: INodeViewModel
  ) {
  }
}
