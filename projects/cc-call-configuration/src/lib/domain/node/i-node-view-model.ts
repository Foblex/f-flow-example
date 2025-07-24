import { IPoint } from '@foblex/2d';
import { ENodeType, INodeValueModel } from '@domain';

export interface INodeViewModel<TKey = string> {

  key: TKey;
  name: string;

  color: string;

  icon: string;

  description?: string;

  isExpanded: boolean;

  isExpandable: boolean;

  outputs: {
    key: TKey;
    name: string;
  }[];

  input?: TKey;

  position: IPoint;

  type: ENodeType;

  value: INodeValueModel | null;
}
