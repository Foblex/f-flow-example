import {IPoint} from "@foblex/2d";
import {IFlowStateNode} from "../models/i-flow-state-node";
import {generateGuid} from "@foblex/utils";
import {ENodeType} from "../enums/e-node-type";

export function createIncomingCallNode(position: IPoint): IFlowStateNode {
  return {
    id: generateGuid(),
    outputs: [{
      id: generateGuid(),
      label: ''
    }],
    position,
    type: ENodeType.IncomingCall,
    value: null
  }
}
