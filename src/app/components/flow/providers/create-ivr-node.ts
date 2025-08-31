import {IPoint} from "@foblex/2d";
import {IFlowStateNode} from "../models/i-flow-state-node";
import {generateGuid} from "@foblex/utils";
import {NodeType} from "../enums/node-type";

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
    type: NodeType.UserInput,
    value: {
      outputs: 3,
      timeout: 5,
    }
  }
}
