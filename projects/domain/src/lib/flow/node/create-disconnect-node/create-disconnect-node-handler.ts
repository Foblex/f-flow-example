import { generateId, IHandler } from '@infrastructure';
import { Injectable } from '@angular/core';
import { CreateDisconnectNodeRequest } from './create-disconnect-node-request';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';

@Injectable({
  providedIn: 'root'
})
export class CreateDisconnectNodeHandler implements IHandler<CreateDisconnectNodeRequest, INodeModel> {

  public handle(request: CreateDisconnectNodeRequest): INodeModel {
    return {
      key: generateId(ENodeType.Disconnect),
      input: generateId(ENodeType.Disconnect) + '_input',
      outputs: [],
      position: request.position,
      type: ENodeType.Disconnect,
      value: null
    }
  }
}
