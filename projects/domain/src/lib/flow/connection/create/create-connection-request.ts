import { IFlowModel } from '../../index';

export class CreateConnectionRequest {

  constructor(
    public flowKey: string,
    public outputNodeKey: string,
    public outputKey: string,
    public inputKey: string,
    public flows: IFlowModel[]
  ) {
  }
}
