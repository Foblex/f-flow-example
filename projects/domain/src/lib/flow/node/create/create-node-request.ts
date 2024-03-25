import { ENodeType, IFlowModel } from '../../index';
import { IPoint } from '@foblex/core';

export class CreateNodeRequest {

  constructor(
    public flowKey: string,
    public type: ENodeType,
    public position: IPoint,
    public flows: IFlowModel[]
  ) {
  }
}
