import { ChangeNodePositionRequest } from './change-node-position-request';
import { IHandler } from '@foblex/core';
import { Injectable } from '@angular/core';
import { IFlowModel } from '../../index';

@Injectable({
  providedIn: 'root'
})
export class ChangeNodePositionHandler implements IHandler<ChangeNodePositionRequest, IFlowModel[]> {

  public handle(request: ChangeNodePositionRequest): IFlowModel[] {

    const flow = request.flows.find(x => x.key === request.flowKey);
    if (!flow) {
      throw new Error('Flow not found');
    }

    const node = flow.nodes.find(x => x.key === request.nodeKey);
    if (!node) {
      throw new Error('Node not found');
    }

    node.position = request.position;

    return request.flows;
  }
}
