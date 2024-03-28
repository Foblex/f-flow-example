import { CreateConnectionRequest } from './create-connection-request';
import { CreateConnectionAction, INodeModel } from '@domain';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { IConnectionViewModel } from '../i-connection-view-model';
import { IFlowViewModel } from '../../i-flow-view-model';
import { GuidExtensions, IHandler } from '@foblex/core';

@Injectable({
  providedIn: 'root'
})
export class CreateConnectionHandler implements IHandler<CreateConnectionRequest, IFlowViewModel> {

  constructor(
    private store: Store
  ) {
  }

  public handle(request: CreateConnectionRequest): IFlowViewModel {

    const outputNode = this.getOutputNode(request.flow, request.outputKey);

    const output = outputNode!.outputs.find((x) => x.key === request.outputKey);

    const result = JSON.parse(JSON.stringify(request.flow));

    result.connections.push(this.createConnection(request.outputKey, request.inputKey, output!.name));

    this.store.dispatch(new CreateConnectionAction(result.key, outputNode!.key, request.outputKey, request.inputKey));

    return result;
  }

  private getOutputNode(flow: IFlowViewModel, outputKey: string): INodeModel {
    const result = flow.nodes.find((x) => {
      return x.outputs.some((y) => y.key === outputKey);
    });

    if (!result) {
      throw new Error('Node not found');
    }

    return result;
  }

  private createConnection(outputKey: string, inputKey: string, outputName: string): IConnectionViewModel {
    const result = {
      key: GuidExtensions.generate(),
      from: outputKey,
      to: inputKey,
      name: outputName
    };

    return result;
  }
}
