export interface IConnectionViewModel<TKey = string> {

  key: string;

  name: string;

  from: TKey;

  to: TKey;
}
