import { Injectable } from '@angular/core';
import { CreateDisconnectNodeRequest } from './create-disconnect-node-request';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { GuidExtensions, IHandler } from '@foblex/core';

@Injectable({
  providedIn: 'root'
})
export class CreateDisconnectNodeHandler implements IHandler<CreateDisconnectNodeRequest, INodeModel> {

  public handle(request: CreateDisconnectNodeRequest): INodeModel {
    return {
      key: GuidExtensions.generate(),
      input: GuidExtensions.generate() + '_input',
      outputs: [],
      position: request.position,
      type: ENodeType.Disconnect,
      value: null
    }
  }
}
