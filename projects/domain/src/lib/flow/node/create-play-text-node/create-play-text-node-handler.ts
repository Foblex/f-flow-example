import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreatePlayTextNodeRequest } from './create-play-text-node-request';
import { EFormBuilderControlType } from '@shared-components';
import { IHandler } from '@foblex/mediator';
import { generateGuid } from '@foblex/utils';

@Injectable({
  providedIn: 'root'
})
export class CreatePlayTextNodeHandler implements IHandler<CreatePlayTextNodeRequest, INodeModel> {

  public handle(request: CreatePlayTextNodeRequest): INodeModel {
    return {
      key: generateGuid(),
      description: 'Input Caller Lookup',
      input: generateGuid() + '_input',
      outputs: [ {
        key: generateGuid(),
        name: 'Output Name'
      } ],
      position: request.position,
      type: ENodeType.PlayText,
      value: {
        groups: [ {
          name: 'Text to Play',
          controls: [ {
            key: generateGuid(),
            name: 'Text to Play',
            type: EFormBuilderControlType.TEXTAREA,
            value: 'Please enter the text to play'
          } ]
        } ]
      }
    }
  }
}
