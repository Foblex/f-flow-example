import { generateId, IHandler } from '@infrastructure';
import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreateIvrNodeRequest } from './create-ivr-node-request';
import { EFormBuilderControlType } from '@form-builder';

@Injectable({
  providedIn: 'root'
})
export class CreateIvrNodeHandler implements IHandler<CreateIvrNodeRequest, INodeModel> {

  public handle(request: CreateIvrNodeRequest): INodeModel {
    return {
      key: generateId(ENodeType.UserInput),
      description: 'Input Caller Lookup',
      input: generateId(ENodeType.UserInput) + '_input',
      outputs: [ {
        key: generateId(ENodeType.UserInput),
        name: 'Output 1',
      }, {
        key: generateId(ENodeType.UserInput),
        name: 'Output 2'
      }, {
        key: generateId(ENodeType.UserInput),
        name: 'Output 3'
      } ],
      position: request.position,
      type: ENodeType.UserInput,
      value: {
        groups: [ {
          name: 'Select Number of Outputs',
          controls: [ {
            key: generateId('control'),
            name: 'Outputs',
            type: EFormBuilderControlType.OUTPUTS_SELECT,
            value: 3,
          } ]
        } ]
      }
    }
  }
}
