import { IEntitySummary } from '@foblex/ng-clarc';

export interface IConnectionViewModel<TKey = string> extends IEntitySummary<TKey> {

  from: TKey;

  to: TKey;
}
