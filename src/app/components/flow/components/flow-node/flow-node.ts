import {
  Component, DestroyRef, effect, inject, Injector,
  input,
  OnInit, output, signal, untracked,
} from '@angular/core';
import {FFlowModule} from '@foblex/flow';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NODE_PARAMS_MAP} from "../../constants/node-params-map";
import {IFlowStateNode} from "../../models/i-flow-state-node";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FlowNodeHeader} from "./flow-node-header/flow-node-header";
import {FlowNodeFooterOutputs} from "./flow-node-footer-outputs/flow-node-footer-outputs";
import {FlowNodeBodyOutputs} from "./flow-node-body-outputs/flow-node-body-outputs";
import {distinctUntilChanged} from "rxjs";
import {FlowApiService} from "../../providers/flow-api.service";
import {NodeType} from "../../enums/node-type";
import {FlowNodeIvrForm} from "./flow-node-ivr-form/flow-node-ivr-form";
import {FlowNodePlayTextForm} from "./flow-node-play-text-form/flow-node-play-text-form";

@Component({
  selector: 'flow-node',
  templateUrl: './flow-node.html',
  standalone: true,
  imports: [
    FFlowModule,
    ReactiveFormsModule,
    FlowNodeHeader,
    FlowNodeFooterOutputs,
    FlowNodeBodyOutputs,
    FlowNodeIvrForm,
    FlowNodePlayTextForm
  ],
  host: {
    '[style.border-top-color]': 'defaultParams[viewModel().type].color',
    '[class.invalid]': 'form.invalid && form.touched',
  }
})
export class FlowNode implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _injector = inject(Injector);
  private readonly _apiService = inject(FlowApiService);

  public readonly viewModel = input.required<IFlowStateNode>();

  public readonly removeConnection = output<string>();

  protected readonly form = new FormControl<any | null>(null);
  protected readonly defaultParams = NODE_PARAMS_MAP;
  protected readonly expanded = signal(false);

  protected readonly nodeType = NodeType;

  public ngOnInit(): void {
    this._listenViewModelChanges();
    this._listenToFormChanges();
  }

  private _listenToFormChanges(): void {
    this.form.valueChanges.pipe(
      distinctUntilChanged((prev, curr) => this._isEqual(prev, curr)),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe((value) => {
      this._apiService.updateNode(this.viewModel().id, {value});
    });
  }

  private _isEqual<TValue>(a: TValue, b: TValue): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  private _listenViewModelChanges(): void {
    effect(() => {
      const viewModel = this.viewModel();
      untracked(() => {
        this.expanded.set(viewModel.isExpanded ?? false);
        this.form.setValue(viewModel.value, {emitEvent: false});
      });
    }, {injector: this._injector});
  }

  protected toggle(isExpanded: boolean): void {
    this._apiService.updateNode(this.viewModel().id, {isExpanded});
  }
}
