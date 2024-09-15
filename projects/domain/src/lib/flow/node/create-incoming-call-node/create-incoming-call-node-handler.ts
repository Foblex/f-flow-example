import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreateIncomingCallNodeRequest } from './create-incoming-call-node-request';
import { generateGuid } from '@foblex/utils';
import { IHandler } from '@foblex/mediator';

@Injectable({
  providedIn: 'root'
})
export class CreateIncomingCallNodeHandler implements IHandler<CreateIncomingCallNodeRequest, INodeModel> {

  public handle(request: CreateIncomingCallNodeRequest): INodeModel {
    return {
      key: generateGuid(),
      outputs: [ {
        key: generateGuid(),
        name: ''
      } ],
      position: request.position,
      type: ENodeType.IncomingCall,
      value: null
    }
  }
}
