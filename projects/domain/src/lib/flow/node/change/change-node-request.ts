import { IFlowModel, INodeOutputModel, INodeValueModel } from '../../index';
import { IPoint } from '@foblex/2d';

export class ChangeNodeRequest {

  constructor(
    public flowKey: string,
    public nodeKey: string,

    public position: IPoint,
    public outputs: INodeOutputModel<string>[],
    public value: INodeValueModel,
    public flows: IFlowModel[]
  ) {
  }
}
