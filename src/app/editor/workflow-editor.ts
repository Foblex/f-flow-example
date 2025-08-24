import {
  ChangeDetectionStrategy,
  Component, computed, effect, inject, Injector, input, OnInit, signal, untracked, viewChild,
} from '@angular/core';
import {
  EFMarkerType, FCanvasChangeEvent,
  FCanvasComponent,
  FCreateConnectionEvent, FCreateNodeEvent,
  FFlowComponent,
  FFlowModule, FMoveNodesEvent,
  FReassignConnectionEvent, FSelectionChangeEvent, FZoomDirective, ICurrentSelection,
} from '@foblex/flow';
import {FormsModule} from '@angular/forms';
import {WorkflowNode} from './components/node/workflow-node';
import {WorkflowActionPanel} from './components/action-panel/workflow-action-panel';
import {WorkflowPalette} from './components/palette/workflow-palette';
import {EFlowActionPanelEvent} from './components/action-panel/e-flow-action-panel-event';
import {A, BACKSPACE, DASH, DELETE, NUMPAD_MINUS, NUMPAD_PLUS} from '@angular/cdk/keycodes';
import {EOperationSystem, PlatformService} from '@foblex/platform';
import {FlowApiService} from "./providers/flow-api.service";
import {FlowState} from "./flow-state";
import {IFlowState} from "./models/i-flow-state";
import {IFlowStateNode, IFlowStateNodeValue} from "./models/i-flow-state-node";

@Component({
  selector: 'workflow-editor',
  templateUrl: './workflow-editor.html',
  styleUrls: ['./workflow-editor.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
    WorkflowNode,
    WorkflowActionPanel,
    WorkflowPalette,
    FormsModule
  ],
  host: {
    '(keydown)': 'onKeyDown($event)',
    'tabindex': '-1'
  }
})
export class WorkflowEditor implements OnInit {

  public readonly id = input.required<string>();

  private readonly _state = inject(FlowState);
  private readonly _apiService = inject(FlowApiService);
  private readonly _injector = inject(Injector);
  private readonly _platform = inject(PlatformService);

  private readonly _flow = viewChild(FFlowComponent);
  private readonly _canvas = viewChild(FCanvasComponent);
  private readonly _zoom = viewChild(FZoomDirective);

  private _isChangeAfterLoadedResetAndCenter = true;

  // Debounce time for canvas change events. It helps to prevent excessive updates when zooming;
  protected readonly fCanvasChangeEventDebounce = 200;

  protected readonly viewModel = signal<IFlowState | undefined>(undefined);

  protected readonly nodes = computed(() => {
    return Object.values(this.viewModel()?.nodes || {});
  });

  protected readonly connections = computed(() => {
    return Object.values(this.viewModel()?.connections || {});
  });

  public eMarkerType = EFMarkerType;

  public ngOnInit(): void {
    this._initializeState();
    this._listenStateChanges();
  }

  private _initializeState(): void {
    effect(() => {
      const id = this.id();
      untracked(() => {
        this._state.initialize(this._apiService.getFlowById(id))
      });
    }, {injector: this._injector});
  }

  private _listenStateChanges(): void {
    effect(() => {
      this._state.changes();
      if (!this._isChangeAfterLoadedResetAndCenter) {
        // send data to server
      }
      untracked(() => this._applyChanges());
    }, {injector: this._injector});
  }

  private _applyChanges(): void {
    this.viewModel.set(this._state.getSnapshot());
    if (!this.viewModel()) {
      return;
    }
    this._reCenterCanvasIfUndedToFirstStep();
    this._applySelectionChanges(this.viewModel()!);
  }

  private _reCenterCanvasIfUndedToFirstStep(): void {
    if (!this._state.canUndo() && !this._isChangeAfterLoadedResetAndCenter) {
      this.editorLoaded();
    }
  }

  private _applySelectionChanges({selection}: IFlowState): void {
    this._flow()?.select(selection?.nodes || [], selection?.connections || [], false);
  }

  protected editorLoaded(): void {
    this._isChangeAfterLoadedResetAndCenter = true;
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected changeCanvasTransform(event: FCanvasChangeEvent): void {
    this._ifCanvasChangedFromInitialReCenterUpdateInitialState(event);
  }

  private _ifCanvasChangedFromInitialReCenterUpdateInitialState(event: FCanvasChangeEvent): void {
    if (this._isChangeAfterLoadedResetAndCenter) {
      this._isChangeAfterLoadedResetAndCenter = false;
      this._state.patchBase({transform: {...event}});
      return;
    }
    this._apiService.transformCanvas(event);
  }


  protected createNode(event: FCreateNodeEvent): void {
    this._apiService.createNode(event);
  }

  protected moveNodes(event: FMoveNodesEvent): void {
    this._apiService.moveNodes(event);
  }

  protected createConnection(event: FCreateConnectionEvent): void {
    this._apiService.createConnection(event);
  }

  protected reassignConnection(event: FReassignConnectionEvent): void {
    this._apiService.reassignConnection(event);
  }

  protected changeSelection(event: FSelectionChangeEvent): void {
    this._apiService.changeSelection(event);
  }

  protected removeConnection(outputId: string): void {
    this._apiService.removeConnection(outputId, this.viewModel()!);
  }

  protected onValueChanged(node: IFlowStateNode, value: IFlowStateNodeValue): void {
    // const selected = this._flow()?.getSelection();
    // node.value = value;
    // this.viewModel = this.injector.get(ChangeNodeHandler).handle(
    //   new ChangeNodeRequest(this.viewModel!, node)
    // );
    //
    // this.changeDetectorRef.detectChanges();
    // setTimeout(() => {
    //   this._flow()?.select(selected.fNodeIds, selected.fConnectionIds);
    // });
  }

  private _selectAll(): void {
    this._flow()?.selectAll();
    this._apiService.selectAll(this.viewModel()!);
  }

  protected onActionPanelEvent(event: EFlowActionPanelEvent): void {
    switch (event) {
      case EFlowActionPanelEvent.SELECT_ALL:
        this._selectAll();
        break;
      case EFlowActionPanelEvent.ZOOM_IN:
        this._zoom()?.zoomIn();
        break;
      case EFlowActionPanelEvent.ZOOM_OUT:
        this._zoom()?.zoomOut();
        break;
      case EFlowActionPanelEvent.FIT_TO_SCREEN:
        this._canvas()?.fitToScreen();
        break;
      case EFlowActionPanelEvent.ONE_TO_ONE:
        this._canvas()?.resetScaleAndCenter();
        break;
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }
    switch (event.keyCode) {
      case BACKSPACE:
      case DELETE:
        this._apiService.removeSelected(this.viewModel()!);
        break;
      case NUMPAD_PLUS:
        if (this._isCommandButton(event)) {
          this._zoom()?.zoomIn();
        }
        break;
      case NUMPAD_MINUS:
      case DASH:
        if (this._isCommandButton(event)) {
          this._zoom()?.zoomOut();
        }
        break;
      case A:
        if (this._isCommandButton(event)) {
          this._selectAll();
        }
        break;
    }
  }

  private _isCommandButton(event: { metaKey: boolean, ctrlKey: boolean }): boolean {
    return this._platform.getOS() === EOperationSystem.MAC_OS ? event.metaKey : event.ctrlKey;
  }
}
