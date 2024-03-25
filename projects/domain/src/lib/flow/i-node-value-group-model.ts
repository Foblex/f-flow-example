import { INodeValueControlModel } from './i-node-value-control-model';
import { IFormBuilderValueGroup } from '@form-builder';

export interface INodeValueGroupModel extends IFormBuilderValueGroup {

  controls: INodeValueControlModel<any>[];
}
