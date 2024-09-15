import { CreateConnectionRequest } from './create-connection-request';
import { IHandler } from '@foblex/mediator';
import { Injectable } from '@angular/core';
import { IFlowModel } from '../../index';

@Injectable({
  providedIn: 'root'
})
export class CreateConnectionHandler implements IHandler<CreateConnectionRequest, IFlowModel[]> {

  public handle(request: CreateConnectionRequest): IFlowModel[] {

    const flow = request.flows.find(x => x.key === request.flowKey);
    if (!flow) {
      throw new Error('Flow not found');
    }

    const outputNode = flow.nodes.find(x => x.key === request.outputNodeKey);
    if (!outputNode) {
      throw new Error('Node not found');
    }

    const output = outputNode.outputs.find(x => x.key === request.outputKey);
    if (!output) {
      throw new Error('Output not found');
    }

    output.connectedTo = request.inputKey;

    return request.flows;
  }
}
