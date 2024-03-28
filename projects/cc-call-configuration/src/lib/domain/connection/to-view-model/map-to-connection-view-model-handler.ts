import { MapToConnectionViewModelRequest } from './map-to-connection-view-model-request';
import { INodeModel } from '@domain';
import { IConnectionViewModel } from '../i-connection-view-model';
import { GuidExtensions, IHandler } from '@foblex/core';

export class MapToConnectionViewModelHandler implements IHandler<MapToConnectionViewModelRequest, IConnectionViewModel[]> {

  public handle(request: MapToConnectionViewModelRequest): IConnectionViewModel[] {

    const result = this.map(request.entity);
    return result;
  }

  private map(node: INodeModel): IConnectionViewModel[] {
    const result = node.outputs.filter(x => !!x.connectedTo).map(x => {
      return {
        key: GuidExtensions.generate(),
        from: x.key,
        to: x.connectedTo,
        name: x.name
      } as IConnectionViewModel;
    });

    return result;
  }
}
