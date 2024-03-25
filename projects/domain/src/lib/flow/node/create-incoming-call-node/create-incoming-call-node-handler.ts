import { generateId, IHandler } from '@infrastructure';
import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreateIncomingCallNodeRequest } from './create-incoming-call-node-request';

@Injectable({
  providedIn: 'root'
})
export class CreateIncomingCallNodeHandler implements IHandler<CreateIncomingCallNodeRequest, INodeModel> {

  public handle(request: CreateIncomingCallNodeRequest): INodeModel {
    return {
      key: generateId(ENodeType.IncomingCall),
      outputs: [ {
        key: generateId(ENodeType.IncomingCall),
        name: ''
      } ],
      position: request.position,
      type: ENodeType.IncomingCall,
      value: null
    }
  }
}
