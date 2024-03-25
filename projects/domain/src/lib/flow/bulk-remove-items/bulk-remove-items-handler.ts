import { BulkRemoveItemsRequest } from './bulk-remove-items-request';
import { IHandler } from '@infrastructure';
import { Injectable } from '@angular/core';
import { IFlowModel } from '../i-flow-model';

@Injectable({
  providedIn: 'root'
})
export class BulkRemoveItemsHandler implements IHandler<BulkRemoveItemsRequest, IFlowModel[]> {

  public handle(request: BulkRemoveItemsRequest): IFlowModel[] {

    const flow = request.flows.find(x => x.key === request.flowKey);
    if (!flow) {
      throw new Error('Flow not found');
    }

    request.outputKeys.forEach((x) => {
      this.clearOutput(flow, x);
    });

    request.nodeKeys.forEach((x) => {
      this.removeNode(flow, x);
    });


    return request.flows;
  }

  private removeNode(flow: IFlowModel, key: string): void {
    flow.nodes = flow.nodes.filter(x => x.key !== key);
  }

  private clearOutput(flow: IFlowModel, outputKey: string): void {
    const node = flow.nodes.find(x => x.outputs.some(y => y.key === outputKey));
    if (!node) {
      throw new Error('Node not found');
    }
    const output = node.outputs.find(x => x.key === outputKey);
    if (!output) {
      throw new Error('Output not found');
    }
    output.connectedTo = undefined;
  }
}
