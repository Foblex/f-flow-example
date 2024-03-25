import { ENodeType } from '../../index';
import { IPoint } from '@foblex/core';

export class ChangeNodePositionAction {

  public static readonly type = '[Flow] Change Node Position';

  constructor(public flowKey: string, public nodeKey: string, public position: IPoint) {

  }
}
