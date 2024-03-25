import { IKeyNameModel } from '@infrastructure';
import { IPoint } from '@foblex/core';
import { ENodeType, INodeValueModel } from '@domain';

export interface INodeViewModel<TKey = string> extends IKeyNameModel<TKey> {

  color: string;

  icon: string;

  description?: string;

  isExpanded: boolean;

  isExpandable: boolean;

  outputs: IKeyNameModel<TKey>[];

  input?: TKey;

  position: IPoint;

  type: ENodeType;

  value: INodeValueModel | null;
}
