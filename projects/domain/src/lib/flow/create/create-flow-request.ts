import { IFlowModel } from '../i-flow-model';

export class CreateFlowRequest {

  constructor(
    public key: string,
    public name: string,
    public flows: IFlowModel[]
  ) {
  }
}
