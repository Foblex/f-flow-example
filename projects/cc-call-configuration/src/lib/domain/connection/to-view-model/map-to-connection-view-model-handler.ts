import { MapToConnectionViewModelRequest } from './map-to-connection-view-model-request';
import { INodeModel } from '@domain';
import { IConnectionViewModel } from '../i-connection-view-model';
import { generateGuid } from '@foblex/utils';
import { IHandler } from '@foblex/mediator';

export class MapToConnectionViewModelHandler implements IHandler<MapToConnectionViewModelRequest, IConnectionViewModel[]> {

  public handle(request: MapToConnectionViewModelRequest): IConnectionViewModel[] {

    const result = this.map(request.entity);
    return result;
  }

  private map(node: INodeModel): IConnectionViewModel[] {
    const result = node.outputs.filter(x => !!x.connectedTo).map(x => {
      return {
        key: generateGuid(),
        from: x.key,
        to: x.connectedTo,
        name: x.name
      } as IConnectionViewModel;
    });

    return result;
  }
}
