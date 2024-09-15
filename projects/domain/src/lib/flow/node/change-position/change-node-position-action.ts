import { IPoint } from '@foblex/2d';

export class ChangeNodePositionAction {

  public static readonly type = '[Flow] Change Node Position';

  constructor(public flowKey: string, public nodeKey: string, public position: IPoint) {

  }
}
