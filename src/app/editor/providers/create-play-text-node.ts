import {IPoint} from "@foblex/2d";
import {IFlowStateNode} from "../models/i-flow-state-node";
import {generateGuid} from "@foblex/utils";
import {ENodeType} from "../enums/e-node-type";
import {EFormBuilderControlType} from "@shared-components";

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
    type: ENodeType.PlayText,
    value: {
      groups: [ {
        name: 'Text to Play',
        controls: [ {
          key: generateGuid(),
          name: 'Text to Play',
          type: EFormBuilderControlType.TEXTAREA,
          value: 'Please enter the text to play'
        } ]
      } ]
    }
  }
}
