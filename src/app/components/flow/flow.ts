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
  FReassignConnectionEvent, FSelectionChangeEvent, FZoomDirective,
} from '@foblex/flow';
import {FormsModule} from '@angular/forms';
import {FlowNode} from './components/flow-node/flow-node';
import {FlowActionPanel} from './components/flow-action-panel/flow-action-panel';
import {FlowPalette} from './components/flow-palette/flow-palette';
import {FlowActionPanelAction} from './components/flow-action-panel/enums/flow-action-panel-action';
import {A, BACKSPACE, DASH, DELETE, NUMPAD_MINUS, NUMPAD_PLUS} from '@angular/cdk/keycodes';
import {EOperationSystem, PlatformService} from '@foblex/platform';
import {FlowApiService} from "./providers/flow-api.service";
import {FlowState} from "./flow-state";
import {IFlowState} from "./models/i-flow-state";

@Component({
  selector: 'flow',
  templateUrl: './flow.html',
  styleUrls: ['./flow.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
    FlowNode,
    FlowActionPanel,
    FlowPalette,
    FormsModule,
  ],
  host: {
    '(keydown)': 'onKeyDown($event)',
    'tabindex': '-1'
  }
})
export class Flow implements OnInit {

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

  protected eMarkerType = EFMarkerType;

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

  protected reset(): void {
    this._flow()?.reset();
    this._apiService.resetFlow(this.id());
    this._isChangeAfterLoadedResetAndCenter = true;
    this._initializeState();
  }

  private _listenStateChanges(): void {
    effect(() => {
      const changes = this._state.changes();
      untracked(() => {
        const model = this._state.getSnapshot();
        if (!this._isChangeAfterLoadedResetAndCenter) {
          this._apiService.saveFlow(model, this.id());
        }
        this._applyChanges(model);
      });
    }, {injector: this._injector});
  }

  private _applyChanges(model: IFlowState): void {
    this.viewModel.set(model);
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

  private _selectAll(): void {
    this._flow()?.selectAll();
    this._apiService.selectAll(this.viewModel()!);
  }

  protected processAction(event: FlowActionPanelAction): void {
    switch (event) {
      case FlowActionPanelAction.SELECT_ALL:
        this._selectAll();
        break;
      case FlowActionPanelAction.ZOOM_IN:
        this._zoom()?.zoomIn();
        break;
      case FlowActionPanelAction.ZOOM_OUT:
        this._zoom()?.zoomOut();
        break;
      case FlowActionPanelAction.FIT_TO_SCREEN:
        this._canvas()?.fitToScreen();
        break;
      case FlowActionPanelAction.ONE_TO_ONE:
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
