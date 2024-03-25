import { TestCallRequest } from './test-call-request';
import { IHandler } from '@infrastructure';
import { ENodeType } from '@domain';
import { Injectable } from '@angular/core';
import { FFlowAnimatorService } from '@foblex/flow-animator';
import { IFlowViewModel } from '../i-flow-view-model';
import { INodeViewModel } from '../i-node-view-model';
import { IConnectionViewModel } from '../i-connection-view-model';

@Injectable({
  providedIn: 'root'
})
export class TestCallHandler implements IHandler<TestCallRequest, void> {

  constructor(
    private fFlowAnimatorService: FFlowAnimatorService,
  ) {
  }

  public handle(request: TestCallRequest): void {

    this.fFlowAnimatorService.animate(
      request.flow.key, this.buildAnimationConfiguration(request.flow)
    ).subscribe();
  }


  private buildAnimationConfiguration(flow: IFlowViewModel): {
    items: { id: string, isConnection?: boolean }[][],
    duration: number,
    removeOverlayAfterRowComplete: boolean
  } {
    const result: { id: string, isConnection?: boolean }[][] = [];

    const firstNode = flow.nodes.find((x) => x.type === ENodeType.IncomingCall);

    result.push([ { id: firstNode!.key } ]);

    const configuration = this.getConfiguration(firstNode!, flow);

    result.push(...configuration);

    return {
      items: result,
      duration: result.length * 2000,
      removeOverlayAfterRowComplete: true
    };
  }

  private getConfiguration(firstNode: INodeViewModel, flow: IFlowViewModel) {
    const result: { id: string, isConnection?: boolean }[][] = [];

    const connectionsRow = this.getConnectionsRow(flow.connections, firstNode);
    if (connectionsRow.length) {
      result.push(connectionsRow);

      const nodesRow = this.getNodesRow(flow.nodes, connectionsRow);
      if(nodesRow.length > 0) {
        result.push(nodesRow);

        nodesRow.forEach((row) => {
          const node = flow.nodes.find((x) => x.key === row.id);
          const configuration = this.getConfiguration(node!, flow);
          result.push(...configuration);
        });
      }
    }

    return result;
  }

  private getConnectionsRow(connections: IConnectionViewModel[], node: INodeViewModel): {
    id: string,
    isConnection: boolean,
    outputKey: string
    inputKey: string
  }[] {
    const connectedOutputs = node.outputs.filter((x) => !!connections.find((y) => y.from === x.key));

    const result = connectedOutputs.map((output) => {
      const connection = connections.find((x) => x.from === output.key);
      return { id: connection!.key, isConnection: true, outputKey: connection!.from, inputKey: connection!.to };
    });

    return result;
  }

  private getNodesRow(nodes: INodeViewModel[], connectionRow: {
    id: string,
    isConnection: boolean,
    outputKey: string
    inputKey: string
  }[]): { id: string }[] {
    const result = connectionRow.map((row) => {
      const node = nodes.find((x) => x.input === row.inputKey);
      return { id: node!.key };
    });

    return result;
  }
}
