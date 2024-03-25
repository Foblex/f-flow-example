import { generateId, IHandler } from '@infrastructure';
import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreateConversationNodeRequest } from './create-conversation-node-request';

@Injectable({
  providedIn: 'root'
})
export class CreateConversationNodeHandler implements IHandler<CreateConversationNodeRequest, INodeModel> {

  public handle(request: CreateConversationNodeRequest): INodeModel {
    return {
      key: generateId(ENodeType.ToOperator),
      input: generateId(ENodeType.ToOperator) + '_input',
      outputs: [
        {
          key: generateId(ENodeType.ToOperator),
          name: 'Call Ended'
        }
      ],
      position: request.position,
      type: ENodeType.ToOperator,
      value: null
    }
  }
}

