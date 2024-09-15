import { ENodeType } from '../../index';
import { IPoint } from '@foblex/2d';

export class CreateNodeAction {

  public static readonly type = '[Flow] Create Node';

  constructor(public flowKey: string, public type: ENodeType, public position: IPoint) {

  }
}
