import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreateConversationNodeRequest } from './create-conversation-node-request';
import { generateGuid } from '@foblex/utils';
import { IHandler } from '@foblex/mediator';

@Injectable({
  providedIn: 'root'
})
export class CreateConversationNodeHandler implements IHandler<CreateConversationNodeRequest, INodeModel> {

  public handle(request: CreateConversationNodeRequest): INodeModel {
    return {
      key: generateGuid(),
      input: generateGuid() + '_input',
      outputs: [
        {
          key: generateGuid(),
          name: 'Call Ended'
        }
      ],
      position: request.position,
      type: ENodeType.ToOperator,
      value: null
    }
  }
}

