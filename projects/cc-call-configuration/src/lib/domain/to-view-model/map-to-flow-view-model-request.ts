import { IFlowModel } from '@domain';

export class MapToFlowViewModelRequest {

  constructor(
    public readonly entity: IFlowModel
  ) {
  }
}
