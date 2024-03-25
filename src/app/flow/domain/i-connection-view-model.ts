import { IKeyNameModel } from '@infrastructure';

export interface IConnectionViewModel<TKey = string> extends IKeyNameModel<TKey> {

  from: TKey;

  to: TKey;
}
