import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreateIvrNodeRequest } from './create-ivr-node-request';
import { EFormBuilderControlType } from '@shared-components';
import { generateGuid } from '@foblex/utils';
import { IHandler } from '@foblex/mediator';

@Injectable({
  providedIn: 'root'
})
export class CreateIvrNodeHandler implements IHandler<CreateIvrNodeRequest, INodeModel> {

  public handle(request: CreateIvrNodeRequest): INodeModel {
    return {
      key: generateGuid(),
      description: 'Input Caller Lookup',
      input: generateGuid() + '_input',
      outputs: [ {
        key: generateGuid(),
        name: 'Output 1',
      }, {
        key: generateGuid(),
        name: 'Output 2'
      }, {
        key: generateGuid(),
        name: 'Output 3'
      } ],
      position: request.position,
      type: ENodeType.UserInput,
      value: {
        groups: [ {
          name: 'Select Number of Outputs',
          controls: [ {
            key: generateGuid(),
            name: 'Outputs',
            type: EFormBuilderControlType.OUTPUTS_SELECT,
            value: 3,
          } ]
        } ]
      }
    }
  }
}
