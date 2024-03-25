import { ReassignConnectionRequest } from './reassign-connection-request';
import { IHandler } from '@infrastructure';
import { CreateConnectionAction, INodeModel } from '@domain';
import { Injectable } from '@angular/core';
import { IConnectionViewModel } from '../i-connection-view-model';
import { IFlowViewModel } from '../i-flow-view-model';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class ReassignConnectionHandler implements IHandler<ReassignConnectionRequest, IFlowViewModel> {

  constructor(
    private store: Store
  ) {
  }

  public handle(request: ReassignConnectionRequest): IFlowViewModel {

    const outputNode = this.getOutputNode(request.flow, request.outputKey);

    const result = JSON.parse(JSON.stringify(request.flow));

    const connection = result.connections.find((x: IConnectionViewModel) => x.from === request.outputKey && x.to === request.oldInputKey);
    if (connection) {
      connection.to = request.newInputKey;
    }

    this.store.dispatch(new CreateConnectionAction(result.key, outputNode.key, request.outputKey, request.newInputKey));

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
}
