import { MapToFlowViewModelRequest } from './map-to-flow-view-model-request';
import { generateId, IHandler } from '@infrastructure';
import { IFlowModel, INodeModel } from '@domain';
import { MapToNodeViewModelHandler } from '../node/to-view-model/map-to-node-view-model-handler';
import { MapToNodeViewModelRequest } from '../node/to-view-model/map-to-node-view-model-request';
import { IFlowViewModel } from '../i-flow-view-model';
import { IConnectionViewModel } from '../i-connection-view-model';
import { INodeViewModel } from '../i-node-view-model';

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
    const result = entity.nodes.reduce((connections: IConnectionViewModel[], node) => {

      const nodeConnections: IConnectionViewModel[] = this.mapNodeConnections(node);

      return connections.concat(nodeConnections);
    }, []);

    return result;
  }

  private mapNodeConnections(node: INodeModel): IConnectionViewModel[] {
    const result = node.outputs.filter(x => !!x.connectedTo).map(x => {
      return {
        key: generateId('CONNECTION'),
        from: x.key,
        to: x.connectedTo,
        name: x.name
      } as IConnectionViewModel;
    });

    return result;
  }
}
