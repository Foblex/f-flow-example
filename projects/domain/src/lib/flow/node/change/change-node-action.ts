import { INodeOutputModel, INodeValueModel } from '../../index';
import { IPoint } from '@foblex/core';

export class ChangeNodeAction {

  public static readonly type = '[Flow] Change Node';

  constructor(
    public flowKey: string,
    public nodeKey: string,
    public position: IPoint,
    public outputs: INodeOutputModel<string>[],
    public value: INodeValueModel,
  ) {

  }
}
