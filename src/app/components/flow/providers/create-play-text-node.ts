import {IPoint} from "@foblex/2d";
import {IFlowStateNode} from "../models/i-flow-state-node";
import {generateGuid} from "@foblex/utils";
import {NodeType} from "../enums/node-type";

export function createPlayTextNode(position: IPoint): IFlowStateNode {
  return {
    id: generateGuid(),
    description: 'Input Caller Lookup',
    input: generateGuid(),
    outputs: [ {
      id: generateGuid(),
      label: 'Output Name'
    } ],
    position,
    type: NodeType.PlayText,
    value: {
      text: 'Hello, this is a text to speech message.',
    }
  }
}
