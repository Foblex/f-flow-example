import { INodeValueControlModel } from './i-node-value-control-model';
import { IFormBuilderValueGroup } from '@shared-components';

export interface INodeValueGroupModel extends IFormBuilderValueGroup {

  controls: INodeValueControlModel<any>[];
}
