import { IKeyNameModel } from '@infrastructure';

export interface INodeOutputModel<TKey> extends IKeyNameModel<TKey> {

  connectedTo?: TKey
}
