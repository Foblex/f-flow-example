import { IKeyNameModel } from '@infrastructure';
import { INodeModel } from './i-node-model';

export interface IFlowModel extends IKeyNameModel<string> {

  nodes: INodeModel<string>[];
}
