import { IPoint } from '@foblex/2d';
import { ENodeType } from './e-node-type';
import { INodeValueModel } from './i-node-value-model';
import { INodeOutputModel } from './i-node-output-model';

export interface INodeModel<TKey = string> {

  key: TKey;

  description?: string;

  isExpanded?: boolean;

  outputs: INodeOutputModel<TKey>[];

  input?: TKey;

  position: IPoint;

  type: ENodeType;

  value: INodeValueModel | null;
}
