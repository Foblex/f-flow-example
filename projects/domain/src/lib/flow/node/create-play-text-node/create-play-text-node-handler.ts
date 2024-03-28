import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreatePlayTextNodeRequest } from './create-play-text-node-request';
import { EFormBuilderControlType } from '@shared-components';
import { GuidExtensions, IHandler } from '@foblex/core';

@Injectable({
  providedIn: 'root'
})
export class CreatePlayTextNodeHandler implements IHandler<CreatePlayTextNodeRequest, INodeModel> {

  public handle(request: CreatePlayTextNodeRequest): INodeModel {
    return {
      key: GuidExtensions.generate(),
      description: 'Input Caller Lookup',
      input: GuidExtensions.generate() + '_input',
      outputs: [ {
        key: GuidExtensions.generate(),
        name: 'Output Name'
      } ],
      position: request.position,
      type: ENodeType.PlayText,
      value: {
        groups: [ {
          name: 'Text to Play',
          controls: [ {
            key: GuidExtensions.generate(),
            name: 'Text to Play',
            type: EFormBuilderControlType.TEXTAREA,
            value: 'Please enter the text to play'
          } ]
        } ]
      }
    }
  }
}
