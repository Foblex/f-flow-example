import { BulkRemoveRequest } from './bulk-remove-request';
import { IHandler } from '@infrastructure';
import { Injectable } from '@angular/core';
import { IConnectionViewModel } from '../i-connection-view-model';
import { IFlowViewModel } from '../i-flow-view-model';
import { Store } from '@ngxs/store';
import { BulkRemoveItemsAction } from '@domain';

@Injectable({
  providedIn: 'root'
})
export class BulkRemoveHandler implements IHandler<BulkRemoveRequest, IFlowViewModel> {

  constructor(
    private store: Store
  ) {
  }

  public handle(request: BulkRemoveRequest): IFlowViewModel {

    let connectionKeys: string[] = request.connectionKeys || [];

    request.nodeKeys.forEach((x) => {
      const keys = this.findAllConnectionsForNode(request.flow, x);
      connectionKeys.push(...keys);
      this.removeNode(request.flow, x);
    });

    const outputKeys = connectionKeys.map((x) => {
      return this.removeConnection(request.flow, x);
    }).filter((x) => x !== undefined) as string[];

    const result = JSON.parse(JSON.stringify(request.flow));
    this.store.dispatch(new BulkRemoveItemsAction(result.key, request.nodeKeys, outputKeys));

    return result;
  }

  private findAllConnectionsForNode(flow: IFlowViewModel, key: string): string[] {
    const node = flow.nodes.find((x) => x.key === key);

    let result: string[] = [];

    if (node) {
      node.outputs.forEach((output) => {
        const connections = flow.connections.filter((c) => c.from === output.key).map((c) => c.key);
        if (connections.length) {
          result.push(...connections);
        }

      });
      const connections = flow.connections.filter((c) => c.to === node.input).map((c) => c.key);
      if (connections.length) {
        result.push(...connections);
      }
    }

    return result;
  }

  private removeConnection(flow: IFlowViewModel, key: string): string | undefined {
    const index = flow.connections.findIndex((x: IConnectionViewModel) => x.key === key);
    if (index === -1) {
      return undefined;
    }
    const result = flow.connections[ index ].from;

    if (index > -1) {
      flow.connections.splice(index, 1);
    }
    return result;
  }

  private removeNode(flow: IFlowViewModel, key: string): void {
    const index = flow.nodes.findIndex((y) => y.key === key);
    if (index > -1) {
      flow.nodes.splice(index, 1);
    }
  }
}
