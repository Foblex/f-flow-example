import {generateGuid} from "@foblex/utils";
import {IPoint} from "@foblex/2d";
import {IFlowStateNode} from "../models/i-flow-state-node";
import {ENodeType} from "../enums/e-node-type";

export function createDisconnectNode(position: IPoint): IFlowStateNode {
  return {
    id: generateGuid(),
    input: generateGuid(),
    outputs: [],
    position,
    type: ENodeType.Disconnect,
    value: null
  }
}
