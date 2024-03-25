import { ENodeType } from '../../index';
import { IPoint } from '@foblex/core';

export class CreateNodeAction {

  public static readonly type = '[Flow] Create Node';

  constructor(public flowKey: string, public type: ENodeType, public position: IPoint) {

  }
}
