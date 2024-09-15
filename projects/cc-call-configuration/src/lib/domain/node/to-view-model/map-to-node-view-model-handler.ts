import { MapToNodeViewModelRequest } from './map-to-node-view-model-request';
import { IHandler } from '@foblex/mediator';
import { INodeModel } from '@domain';
import { NODE_STATIC_MAP } from '../static-map';
import { INodeViewModel } from '../i-node-view-model';

export class MapToNodeViewModelHandler implements IHandler<MapToNodeViewModelRequest, INodeViewModel> {

  public handle(request: MapToNodeViewModelRequest): INodeViewModel {

    const result = this.map(request.entity);
    return result;
  }

  private map(entity: INodeModel): INodeViewModel {

    const result = {
      key: entity.key,
      icon: NODE_STATIC_MAP[ entity.type ].icon,
      color: NODE_STATIC_MAP[ entity.type ].color,
      name: NODE_STATIC_MAP[ entity.type ].name,
      description: entity.description || '',
      isExpanded: entity.isExpanded || false,
      isExpandable: NODE_STATIC_MAP[ entity.type ].isExpandable,
      input: entity.input,
      outputs: entity.outputs.map((output) => {
        return {
          key: output.key,
          name: output.name
        };
      }),
      type: entity.type,
      position: entity.position,
      value: entity.value,
    }

    return result;
  }
}
