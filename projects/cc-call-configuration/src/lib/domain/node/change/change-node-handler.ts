import { ChangeNodeRequest } from './change-node-request';
import { ChangeNodeAction, INodeOutputModel, INodeValueModel } from '@domain';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { IFlowViewModel } from '../../i-flow-view-model';
import { EFormBuilderControlType } from '@shared-components';
import { INodeViewModel } from '../i-node-view-model';
import { IConnectionViewModel } from '../../connection';
import { IHandler } from '@foblex/mediator';
import { IEntitySummary } from '@foblex/ng-clarc';

@Injectable({
  providedIn: 'root'
})
export class ChangeNodeHandler implements IHandler<ChangeNodeRequest, IFlowViewModel> {

  constructor(
    private store: Store
  ) {
  }

  public handle(request: ChangeNodeRequest): IFlowViewModel {

    const flow = JSON.parse(JSON.stringify(request.flow));

    const index = flow.nodes.findIndex((x: INodeViewModel) => x.key === request.node.key);

    flow.nodes[ index ] = request.node;

    const outputsNumberValue = this.findOutputsNumberValue(flow.nodes[ index ].value);
    if (outputsNumberValue) {
      flow.nodes[ index ].outputs = this.mergeOutputsWithNumber(flow, flow.nodes[ index ], outputsNumberValue);
    }

    const node = flow.nodes[ index ];

    const outputs: INodeOutputModel<string>[] = node.outputs.map((x: IEntitySummary<string>) => {
      return {
        key: x.key,
        name: x.name,
        connectedTo: flow.connections.find((connection: IConnectionViewModel) => connection.from === x.key)?.to || null
      };
    });

    this.store.dispatch(new ChangeNodeAction(request.flow.key, node.key, node.position, outputs, node.value));

    return flow;
  }

  private findOutputsNumberValue(value: INodeValueModel | null): number | undefined {
    let result: number | undefined;
    const group = value?.groups.find((x) => x.controls.some((x) => {
      return x.type === EFormBuilderControlType.OUTPUTS_SELECT;
    }));
    if (group) {
      const control = group.controls.find((x) => x.type === EFormBuilderControlType.OUTPUTS_SELECT);
      result = control?.value;
    }
    return result;
  }

  private mergeOutputsWithNumber(flow: IFlowViewModel, node: INodeViewModel, outputsNumber: number): IEntitySummary<string>[] {
    const outputs = node.outputs.slice(0, outputsNumber);

    const outputsToRemove = node.outputs.slice(outputsNumber);
    outputsToRemove.forEach((x) => {
      flow.connections = flow.connections.filter((connection) => {
        return connection.from !== x.key;
      });
    });

    if (outputs.length < outputsNumber) {
      for (let i = outputs.length; i < outputsNumber; i++) {
        outputs.push({ key: `output-${ i }`, name: `Output ${ i }` });
      }
    }
    return outputs;
  }
}
