import { INodeModel } from '@domain';

export class MapToConnectionViewModelRequest {

  constructor(
    public readonly entity: INodeModel
  ) {
  }
}
