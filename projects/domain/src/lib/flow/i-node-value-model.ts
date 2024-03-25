import { INodeValueGroupModel } from './i-node-value-group-model';
import { IFormBuilderValue } from '@form-builder';

export interface INodeValueModel extends IFormBuilderValue {

  groups: INodeValueGroupModel[]
}
