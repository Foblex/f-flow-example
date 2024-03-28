import { INodeValueGroupModel } from './i-node-value-group-model';
import { IFormBuilderValue } from '@shared-components';

export interface INodeValueModel extends IFormBuilderValue {

  groups: INodeValueGroupModel[]
}
