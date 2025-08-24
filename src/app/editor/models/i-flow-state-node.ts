import {IPoint} from "@foblex/2d";
import {ENodeType} from "../enums/e-node-type";
import {IFormBuilderValue, IFormBuilderValueControl, IFormBuilderValueGroup} from "@shared-components";

export interface IFlowStateNode {
  id: string;
  description?: string;
  isExpanded?: boolean;
  outputs: INodeOutput[];
  input?: string;
  position: IPoint;
  type: ENodeType;
  value: IFlowStateNodeValue | null;
}

export interface INodeOutput {
  id: string;
  label: string;
}

export interface IFlowStateNodeControl<TValue = any>
  extends IFormBuilderValueControl<TValue> {
}

export interface IFlowStateNodeValue extends IFormBuilderValue {
  groups: IFlowStateNodeValueGroup[]
}

export interface IFlowStateNodeValueGroup extends IFormBuilderValueGroup {
  controls: IFlowStateNodeControl<any>[];
}
