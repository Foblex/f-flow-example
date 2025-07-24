import {Action, Selector, State, StateContext} from '@ngxs/store';
import {CreateFlowAction} from './create/create-flow-action';
import {CreateFlowHandler} from './create/create-flow-handler';
import {Injectable, Injector} from '@angular/core';
import {IFlowModel} from './i-flow-model';
import {CreateFlowRequest} from './create/create-flow-request';
import {CreateNodeAction} from './node/create/create-node-action';
import {CreateNodeHandler} from './node/create/create-node-handler';
import {CreateNodeRequest} from './node/create/create-node-request';
import {ChangeNodePositionAction} from './node/change-position/change-node-position-action';
import {ChangeNodePositionHandler} from './node/change-position/change-node-position-handler';
import {ChangeNodePositionRequest} from './node/change-position/change-node-position-request';
import {CreateConnectionAction} from './connection/create/create-connection-action';
import {CreateConnectionHandler} from './connection/create/create-connection-handler';
import {CreateConnectionRequest} from './connection/create/create-connection-request';
import {BulkRemoveItemsAction} from './bulk-remove-items/bulk-remove-items-action';
import {BulkRemoveItemsHandler} from './bulk-remove-items/bulk-remove-items-handler';
import {BulkRemoveItemsRequest} from './bulk-remove-items/bulk-remove-items-request';
import {ChangeNodeAction} from './node/change/change-node-action';
import {ChangeNodeHandler} from './node/change/change-node-handler';
import {ChangeNodeRequest} from './node/change/change-node-request';
import {RemoveFlowAction} from './remove/remove-flow-action';

interface IFlowState {

  flows: IFlowModel[];
}

@Injectable()
@State<IFlowState>({
  name: 'flows',
  defaults: {
    flows: JSON.parse(localStorage.getItem('flows')!) || []
  }
})
export class FlowState {

  @Selector()
  public static summaryList(state: IFlowState): {
    key: string;
    name: string;
  }[] {
    return state.flows.map((x) => {
      return {
        key: x.key,
        name: x.name
      };
    });
  }

  constructor(
    private injector: Injector
  ) {
  }


  @Action(CreateFlowAction)
  public create(context: StateContext<IFlowState>, {key, name}: CreateFlowAction) {

    const result = this.injector.get(CreateFlowHandler).handle(
      new CreateFlowRequest(key, name, context.getState().flows)
    );
    localStorage.setItem('flows', JSON.stringify([...context.getState().flows, result]));

    context.patchState({
      flows: [...context.getState().flows, result]
    });
  }

  @Action(CreateNodeAction)
  public createNode(context: StateContext<IFlowState>, {flowKey, type, position}: CreateNodeAction) {

    const result = this.injector.get(CreateNodeHandler).handle(
      new CreateNodeRequest(flowKey, type, position, context.getState().flows)
    );
    localStorage.setItem('flows', JSON.stringify([...result]));

    context.patchState({
      flows: [...result]
    });
  }

  @Action(ChangeNodePositionAction)
  public changeNodePosition(context: StateContext<IFlowState>, {flowKey, nodeKey, position}: ChangeNodePositionAction) {

    const result = this.injector.get(ChangeNodePositionHandler).handle(
      new ChangeNodePositionRequest(flowKey, nodeKey, position, context.getState().flows)
    );
    localStorage.setItem('flows', JSON.stringify([...result]));

    context.patchState({
      flows: [...result]
    });
  }

  @Action(ChangeNodeAction)
  public changeNode(context: StateContext<IFlowState>, {flowKey, nodeKey, position, outputs, value}: ChangeNodeAction) {

    const result = this.injector.get(ChangeNodeHandler).handle(
      new ChangeNodeRequest(flowKey, nodeKey, position, outputs, value, context.getState().flows)
    );
    localStorage.setItem('flows', JSON.stringify([...result]));

    context.patchState({
      flows: [...result]
    });
  }

  @Action(CreateConnectionAction)
  public createConnection(context: StateContext<IFlowState>, {
    flowKey,
    outputNodeKey,
    outputKey,
    inputKey
  }: CreateConnectionAction) {

    const result = this.injector.get(CreateConnectionHandler).handle(
      new CreateConnectionRequest(flowKey, outputNodeKey, outputKey, inputKey, context.getState().flows)
    );

    localStorage.setItem('flows', JSON.stringify([...result]));
    context.patchState({
      flows: [...result]
    });
  }

  @Action(BulkRemoveItemsAction)
  public removeConnection(context: StateContext<IFlowState>, {flowKey, nodeKeys, outputKeys}: BulkRemoveItemsAction) {

    const result = this.injector.get(BulkRemoveItemsHandler).handle(
      new BulkRemoveItemsRequest(flowKey, nodeKeys, outputKeys, context.getState().flows)
    );

    localStorage.setItem('flows', JSON.stringify([...result]));
    context.patchState({
      flows: [...result]
    });
  }


  @Action(RemoveFlowAction)
  public remove({getState, patchState}: StateContext<IFlowState>, {key}: RemoveFlowAction) {

    const flows = getState().flows.filter(flow => flow.key !== key);

    patchState({
      flows: flows
    });
  }
}
