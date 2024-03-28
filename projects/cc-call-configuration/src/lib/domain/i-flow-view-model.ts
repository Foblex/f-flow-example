import { INodeViewModel } from './node';
import { IConnectionViewModel } from './connection';

export interface IFlowViewModel {

  key: string;

  nodes: INodeViewModel[];

  connections: IConnectionViewModel[];
}
