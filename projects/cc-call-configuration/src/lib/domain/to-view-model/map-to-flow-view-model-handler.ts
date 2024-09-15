import { MapToFlowViewModelRequest } from './map-to-flow-view-model-request';
import { IHandler } from '@foblex/mediator';
import { IFlowModel } from '@domain';
import { IFlowViewModel } from '../i-flow-view-model';
import { IConnectionViewModel, MapToConnectionViewModelHandler, MapToConnectionViewModelRequest } from '../connection';
import { INodeViewModel, MapToNodeViewModelHandler, MapToNodeViewModelRequest } from '../node';

export class MapToFlowViewModelHandler implements IHandler<MapToFlowViewModelRequest, IFlowViewModel> {

  public handle(request: MapToFlowViewModelRequest): IFlowViewModel {
    const result = this.map(request.entity);

    return result;
  }

  private map(entity: IFlowModel): IFlowViewModel {

    const nodes = this.mapNodes(entity);

    const connections: IConnectionViewModel[] = this.mapConnections(entity);

    return {
      key: entity.key,
      nodes: nodes,
      connections: connections
    };
  }

  private mapNodes(entity: IFlowModel): INodeViewModel[] {
    const result = entity.nodes.map(x => new MapToNodeViewModelHandler().handle(
      new MapToNodeViewModelRequest(x)
    ));

    return result;
  }

  private mapConnections(entity: IFlowModel): IConnectionViewModel[] {
    const result = entity.nodes.reduce((allConnections: IConnectionViewModel[], node) => {

      const connections: IConnectionViewModel[] = new MapToConnectionViewModelHandler().handle(
        new MapToConnectionViewModelRequest(node)
      );

      return allConnections.concat(connections);
    }, []);

    return result;
  }
}
