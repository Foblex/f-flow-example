import { IFlowModel } from '@domain';
import { CreateFlowRequest } from './create-flow-request';
import { Injectable, Injector } from '@angular/core';
import { throwError } from 'rxjs';
import { CreateIncomingCallNodeHandler } from '../node/create-incoming-call-node/create-incoming-call-node-handler';
import { CreateIncomingCallNodeRequest } from '../node/create-incoming-call-node/create-incoming-call-node-request';
import { CreateDisconnectNodeHandler } from '../node/create-disconnect-node/create-disconnect-node-handler';
import { CreateDisconnectNodeRequest } from '../node/create-disconnect-node/create-disconnect-node-request';
import { IHandler } from '@foblex/mediator';

@Injectable({
  providedIn: 'root'
})
export class CreateFlowHandler implements IHandler<CreateFlowRequest, IFlowModel> {

  constructor(
    private injector: Injector
  ) {
  }

  public handle(request: CreateFlowRequest): IFlowModel {

    const existingFlow = request.flows.find(x => x.name === request.name);
    if (existingFlow) {
      throwError(() => new Error('Flow with the same name already exists'));
    }

    const height = window.innerHeight;
    const width = window.innerWidth;

    const incomingCallNode = this.injector.get(CreateIncomingCallNodeHandler).handle(
      new CreateIncomingCallNodeRequest({ x: width / 2, y: (height / 8) * 2 })
    );

    const disconnectNode = this.injector.get(CreateDisconnectNodeHandler).handle(
      new CreateDisconnectNodeRequest({ x: width / 2, y: (height / 8) * 6 })
    );

    incomingCallNode.outputs[0].connectedTo = disconnectNode.input;

    return {
      key: request.key,
      name: request.name,
      nodes: [
        incomingCallNode,
        disconnectNode
      ]
    }
  }
}
