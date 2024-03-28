import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreateIvrNodeRequest } from './create-ivr-node-request';
import { EFormBuilderControlType } from '@shared-components';
import { GuidExtensions, IHandler } from '@foblex/core';

@Injectable({
  providedIn: 'root'
})
export class CreateIvrNodeHandler implements IHandler<CreateIvrNodeRequest, INodeModel> {

  public handle(request: CreateIvrNodeRequest): INodeModel {
    return {
      key: GuidExtensions.generate(),
      description: 'Input Caller Lookup',
      input: GuidExtensions.generate() + '_input',
      outputs: [ {
        key: GuidExtensions.generate(),
        name: 'Output 1',
      }, {
        key: GuidExtensions.generate(),
        name: 'Output 2'
      }, {
        key: GuidExtensions.generate(),
        name: 'Output 3'
      } ],
      position: request.position,
      type: ENodeType.UserInput,
      value: {
        groups: [ {
          name: 'Select Number of Outputs',
          controls: [ {
            key: GuidExtensions.generate(),
            name: 'Outputs',
            type: EFormBuilderControlType.OUTPUTS_SELECT,
            value: 3,
          } ]
        } ]
      }
    }
  }
}
