import { generateId, IHandler } from '@infrastructure';
import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreatePlayTextNodeRequest } from './create-play-text-node-request';
import { EFormBuilderControlType } from '@form-builder';

@Injectable({
  providedIn: 'root'
})
export class CreatePlayTextNodeHandler implements IHandler<CreatePlayTextNodeRequest, INodeModel> {

  public handle(request: CreatePlayTextNodeRequest): INodeModel {
    return {
      key: generateId(ENodeType.PlayText),
      description: 'Input Caller Lookup',
      input: generateId(ENodeType.PlayText) + '_input',
      outputs: [ {
        key: generateId(ENodeType.PlayText),
        name: 'Output Name'
      } ],
      position: request.position,
      type: ENodeType.PlayText,
      value: {
        groups: [ {
          name: 'Text to Play',
          controls: [ {
            key: generateId('control'),
            name: 'Text to Play',
            type: EFormBuilderControlType.TEXTAREA,
            value: 'Please enter the text to play'
          } ]
        } ]
      }
    }
  }
}
