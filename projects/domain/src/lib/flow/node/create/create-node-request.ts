import { ENodeType, IFlowModel } from '../../index';
import { IPoint } from '@foblex/2d';

export class CreateNodeRequest {

  constructor(
    public flowKey: string,
    public type: ENodeType,
    public position: IPoint,
    public flows: IFlowModel[]
  ) {
  }
}
