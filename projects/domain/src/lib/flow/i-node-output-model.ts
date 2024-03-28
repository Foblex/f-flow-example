import { IEntitySummary } from '@foblex/ng-clarc';

export interface INodeOutputModel<TKey> extends IEntitySummary<TKey> {

  connectedTo?: TKey
}
