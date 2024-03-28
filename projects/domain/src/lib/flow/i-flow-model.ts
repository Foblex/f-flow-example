import { INodeModel } from './i-node-model';
import { IEntitySummary } from '@foblex/ng-clarc';

export interface IFlowModel extends IEntitySummary<string> {

  nodes: INodeModel<string>[];
}
