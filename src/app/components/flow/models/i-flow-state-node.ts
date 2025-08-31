import {IPoint} from "@foblex/2d";
import {NodeType} from "../enums/node-type";

export interface IFlowStateNode<TValue = any> {
  id: string;
  description?: string;
  isExpanded?: boolean;
  outputs: INodeOutput[];
  input?: string;
  position: IPoint;
  type: NodeType;
  value: TValue | null;
}

export interface INodeOutput {
  id: string;
  label: string;
}

