import {generateGuid} from "@foblex/utils";
import {IFlowStateNode} from "../models/i-flow-state-node";
import {IPoint} from "@foblex/2d";
import {ENodeType} from "../enums/e-node-type";

export function createConversationNode(position: IPoint): IFlowStateNode {
  return {
    id: generateGuid(),
    input: generateGuid(),
    outputs: [
      {
        id: generateGuid(),
        label: 'Call Ended'
      }
    ],
    position,
    type: ENodeType.ToOperator,
    value: null
  }
}
