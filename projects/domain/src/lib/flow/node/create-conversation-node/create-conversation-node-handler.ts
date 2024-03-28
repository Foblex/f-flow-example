import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreateConversationNodeRequest } from './create-conversation-node-request';
import { GuidExtensions, IHandler } from '@foblex/core';

@Injectable({
  providedIn: 'root'
})
export class CreateConversationNodeHandler implements IHandler<CreateConversationNodeRequest, INodeModel> {

  public handle(request: CreateConversationNodeRequest): INodeModel {
    return {
      key: GuidExtensions.generate(),
      input: GuidExtensions.generate() + '_input',
      outputs: [
        {
          key: GuidExtensions.generate(),
          name: 'Call Ended'
        }
      ],
      position: request.position,
      type: ENodeType.ToOperator,
      value: null
    }
  }
}

