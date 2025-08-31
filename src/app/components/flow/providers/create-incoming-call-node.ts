import {IPoint} from "@foblex/2d";
import {IFlowStateNode} from "../models/i-flow-state-node";
import {generateGuid} from "@foblex/utils";
import {NodeType} from "../enums/node-type";

export function createIncomingCallNode(position: IPoint): IFlowStateNode {
  return {
    id: generateGuid(),
    outputs: [{
      id: generateGuid(),
      label: ''
    }],
    position,
    type: NodeType.IncomingCall,
    value: null
  }
}
