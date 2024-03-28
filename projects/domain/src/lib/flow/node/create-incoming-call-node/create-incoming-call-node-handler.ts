import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreateIncomingCallNodeRequest } from './create-incoming-call-node-request';
import { GuidExtensions, IHandler } from '@foblex/core';

@Injectable({
  providedIn: 'root'
})
export class CreateIncomingCallNodeHandler implements IHandler<CreateIncomingCallNodeRequest, INodeModel> {

  public handle(request: CreateIncomingCallNodeRequest): INodeModel {
    return {
      key: GuidExtensions.generate(),
      outputs: [ {
        key: GuidExtensions.generate(),
        name: ''
      } ],
      position: request.position,
      type: ENodeType.IncomingCall,
      value: null
    }
  }
}
