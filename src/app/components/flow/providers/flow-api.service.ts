import {inject, Injectable} from "@angular/core";
import {IFlowState} from "../models/i-flow-state";
import {FlowState} from "../flow-state";
import {
  FCanvasChangeEvent,
  FCreateConnectionEvent, FCreateNodeEvent,
  FMoveNodesEvent,
  FReassignConnectionEvent,
  FSelectionChangeEvent
} from "@foblex/flow";
import {generateGuid} from "@foblex/utils";
import {IPoint, PointExtensions} from "@foblex/2d";
import {NodeType} from "../enums/node-type";
import {IFlowStateNode} from "../models/i-flow-state-node";
import {createIncomingCallNode} from "./create-incoming-call-node";
import {createPlayTextNode} from "./create-play-text-node";
import {createIvrNode} from "./create-ivr-node";
import {createConversationNode} from "./create-conversation-node";
import {createDisconnectNode} from "./create-disconnect-node";
import {IFlowStateConnection} from "../models/i-flow-state-connection";

@Injectable({
  providedIn: 'root'
})
export class FlowApiService {

  private readonly _state = inject(FlowState);

  public getFlowById(flowId: string): IFlowState {
    const model = localStorage.getItem("flow" + flowId);
    if (model) {
      return JSON.parse(model) as IFlowState;
    }
    const incomingCallNode = createIncomingCallNode(PointExtensions.initialize(0, 0));
    const disconnectNode = createDisconnectNode(PointExtensions.initialize(0, 400));

    const connectionId = generateGuid();
    return {
      nodes: {
        [incomingCallNode.id]: incomingCallNode,
        [disconnectNode.id]: disconnectNode
      },
      connections: {
        [connectionId]: {
          id: connectionId, source: incomingCallNode.outputs[0].id, target: disconnectNode.input!
        }
      }
    }
  }

  public saveFlow(flow: IFlowState, flowId: string): void {
    localStorage.setItem("flow" + flowId, JSON.stringify(flow));
  }

  public resetFlow(flowId: string): void {
    localStorage.removeItem("flow" + flowId);
  }

  public transformCanvas(event: FCanvasChangeEvent): void {
    this._state.update({
      transform: createTransformObject(event)
    }, 'transformCanvas');
  }

  public createNode(event: FCreateNodeEvent): void {
    let node: IFlowStateNode | undefined;
    switch (event.data) {
      case NodeType.IncomingCall:
        node = createIncomingCallNode(event.rect);
        break;
      case NodeType.PlayText:
        node = createPlayTextNode(event.rect);
        break;
      case NodeType.UserInput:
        node = createIvrNode(event.rect);
        break;
      case NodeType.ToOperator:
        node = createConversationNode(event.rect);
        break;
      case NodeType.Disconnect:
        node = createDisconnectNode(event.rect);
        break;
      default:
        throw new Error('Unknown node type');
    }
    this._state.create({
      nodes: {
        [node.id]: node
      },
      selection: {
        nodes: [node.id],
        connections: []
      }
    }, 'createNode');
  }

  public createConnection(event: FCreateConnectionEvent): void {
    if (!event.fInputId) {
      return;
    }
    const connection = createConnectionObject(event);
    this._state.create({
      connections: {
        [connection.id]: connection
      },
      selection: {
        nodes: [],
        connections: [connection.id]
      }
    });
  }

  public reassignConnection(event: FReassignConnectionEvent): void {
    if (!event.newTargetId) {
      return;
    }
    this._state.update({
      connections: {
        [event.connectionId]: {target: event.newTargetId}
      },
      selection: {
        nodes: [],
        connections: [event.connectionId]
      }
    });
  }

  public moveNodes(event: FMoveNodesEvent): void {
    this._state.update({
      nodes: createMoveNodesChangeObject(event.fNodes)
    }, 'moveNodes');
  }

  public changeSelection(event: FSelectionChangeEvent): void {
    this._state.update({
      selection: {
        nodes: [...event.fNodeIds],
        connections: [...event.fConnectionIds],
      }
    }, 'changeSelection');
  }

  public selectAll(state: IFlowState): void {
    this._state.update({
      selection: {
        nodes: [...Object.keys(state.nodes)],
        connections: [...Object.keys(state.connections)]
      }
    }, 'selectAll');
  }

  public removeConnection(outputId: string, state: IFlowState): void {
    const id = Object.values(state.connections).find(x => x.source === outputId)?.id;

    this._state.delete({
      connections: Object.fromEntries([id].map(id => [id, null])) as any
    }, 'removeConnection');
  }

  public removeSelected(state: IFlowState): void {
    const selectedNodeIds = state.selection?.nodes ?? [];
    const selectedConnIds = state.selection?.connections ?? [];
    if (!selectedConnIds.length && !selectedNodeIds.length) {
      return;
    }

    const connIdsToDelete = new Set<string>(selectedConnIds);
    const allConnections = Object.values(state.connections);
    for (const nodeId of selectedNodeIds) {
      const node = state.nodes[nodeId];
      if (!node) continue;

      this._findConnectionsUsedInNode(node, allConnections).forEach(cid => connIdsToDelete.add(cid));
    }

    this._state.delete({
      nodes: Object.fromEntries(selectedNodeIds.map(id => [id, null])) as any,
      connections: Object.fromEntries([...connIdsToDelete].map(id => [id, null])) as any,
      selection: undefined
    }, 'removeSelected');
  }

  private _findConnectionsUsedInNode(node: IFlowStateNode, connections: IFlowStateConnection[]): string[] {
    let result: string[] = [];
    result = result.concat(connections.filter(x => x.target === node.input).map(x => x.id));

    const outputs = node.outputs.map((x) => x.id);
    result = result.concat(connections.filter(x => outputs.includes(x.source)).map(x => x.id));

    return result;
  }

  public updateNode(nodeId: string, value: Partial<IFlowStateNode>): void {
    this._state.update({
      nodes: {
        [nodeId]: {
          ...value
        }
      }
    }, 'updateNode');
  }
}

function createTransformObject({position, scale}: FCanvasChangeEvent) {
  return {position, scale};
}

function createConnectionObject({fOutputId, fInputId}: FCreateConnectionEvent) {
  return {
    id: generateGuid(), source: fOutputId, target: fInputId!
  }
}

function createMoveNodesChangeObject(nodes: { id: string; position: IPoint; }[]) {
  return Object.fromEntries(nodes.map(({id, position}) => [id, {position}]));
}
