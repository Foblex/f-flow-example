import { INodeModel } from '@domain';

export class MapToNodeViewModelRequest {

  constructor(
    public readonly entity: INodeModel
  ) {
  }
}
