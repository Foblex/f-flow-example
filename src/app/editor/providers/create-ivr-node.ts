import {IPoint} from "@foblex/2d";
import {IFlowStateNode} from "../models/i-flow-state-node";
import {generateGuid} from "@foblex/utils";
import {ENodeType} from "../enums/e-node-type";
import {EFormBuilderControlType} from "@shared-components";

export function createIvrNode(position: IPoint): IFlowStateNode {
  return {
    id: generateGuid(),
    description: 'Input Caller Lookup',
    input: generateGuid(),
    outputs: [{
      id: generateGuid(),
      label: 'Output 1',
    }, {
      id: generateGuid(),
      label: 'Output 2'
    }, {
      id: generateGuid(),
      label: 'Output 3'
    }],
    position,
    type: ENodeType.UserInput,
    value: {
      groups: [{
        name: 'Select Number of Outputs',
        controls: [{
          key: generateGuid(),
          name: 'Outputs',
          type: EFormBuilderControlType.OUTPUTS_SELECT,
          value: 3,
        }]
      }]
    }
  }
}
