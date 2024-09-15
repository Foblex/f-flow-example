import { Injectable } from '@angular/core';
import { CreateDisconnectNodeRequest } from './create-disconnect-node-request';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { generateGuid } from '@foblex/utils';
import { IHandler } from '@foblex/mediator';

@Injectable({
  providedIn: 'root'
})
export class CreateDisconnectNodeHandler implements IHandler<CreateDisconnectNodeRequest, INodeModel> {

  public handle(request: CreateDisconnectNodeRequest): INodeModel {
    return {
      key: generateGuid(),
      input: generateGuid() + '_input',
      outputs: [],
      position: request.position,
      type: ENodeType.Disconnect,
      value: null
    }
  }
}
