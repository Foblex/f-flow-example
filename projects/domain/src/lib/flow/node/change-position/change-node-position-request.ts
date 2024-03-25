import { IFlowModel } from '../../index';
import { IPoint } from '@foblex/core';

export class ChangeNodePositionRequest {

  constructor(
    public flowKey: string,
    public nodeKey: string,
    public position: IPoint,
    public flows: IFlowModel[]
  ) {
  }
}
