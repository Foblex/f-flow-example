import { ChangeNodeRequest } from './change-node-request';
import { IHandler } from '@foblex/core';
import { Injectable } from '@angular/core';
import { IFlowModel } from '../../index';

@Injectable({
  providedIn: 'root'
})
export class ChangeNodeHandler implements IHandler<ChangeNodeRequest, IFlowModel[]> {

  public handle(request: ChangeNodeRequest): IFlowModel[] {

    const flow = request.flows.find(x => x.key === request.flowKey);
    if (!flow) {
      throw new Error('Flow not found');
    }

    const node = flow.nodes.find(x => x.key === request.nodeKey);
    if (!node) {
      throw new Error('Node not found');
    }

    node.position = request.position;
    node.value = request.value;
    node.outputs = request.outputs;


    return request.flows;
  }
}
