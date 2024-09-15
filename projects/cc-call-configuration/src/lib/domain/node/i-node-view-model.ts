import { IPoint } from '@foblex/2d';
import { ENodeType, INodeValueModel } from '@domain';
import { IEntitySummary } from '@foblex/ng-clarc';

export interface INodeViewModel<TKey = string> extends IEntitySummary<TKey> {

  color: string;

  icon: string;

  description?: string;

  isExpanded: boolean;

  isExpandable: boolean;

  outputs: IEntitySummary<TKey>[];

  input?: TKey;

  position: IPoint;

  type: ENodeType;

  value: INodeValueModel | null;
}
