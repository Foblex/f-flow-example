
export interface INodeOutputModel<TKey>  {

  key: string;

  name: string;

  connectedTo?: TKey
}
