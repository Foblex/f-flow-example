import { INodeViewModel } from './i-node-view-model';
import { IConnectionViewModel } from './i-connection-view-model';

export interface IFlowViewModel {

  key: string;

  nodes: INodeViewModel[];

  connections: IConnectionViewModel[];
}
