import { INodeModel } from './i-node-model';

export interface IFlowModel {

  key: string;

  name: string;

  nodes: INodeModel<string>[];
}
