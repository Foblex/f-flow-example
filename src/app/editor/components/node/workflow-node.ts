import {
  Component, DestroyRef, effect, inject, Injector,
  input,
  OnInit, output, signal,
} from '@angular/core';
import {FFlowModule} from '@foblex/flow';
import {MatIcon} from '@angular/material/icon';
import {FormBuilderDirective} from '@shared-components';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NODE_PARAMS_MAP} from "../../constants/node-params-map";
import {IFlowStateNode, IFlowStateNodeValue, INodeOutput} from "../../models/i-flow-state-node";
import {FlowState} from "../../flow-state";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'workflow-node',
  templateUrl: './workflow-node.html',
  styleUrls: ['./workflow-node.scss'],
  standalone: true,
  imports: [
    FFlowModule,
    MatIcon,
    FormBuilderDirective,
    ReactiveFormsModule
  ],
  host: {
    '[style.border-top-color]': 'defaultParams[viewModel().type].color',
  }
})
export class WorkflowNode implements OnInit {
  private readonly _state = inject(FlowState);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _injector = inject(Injector);

  public readonly viewModel = input.required<IFlowStateNode>();

  public readonly valueChange = output<IFlowStateNodeValue>();
  public readonly removeConnection = output<string>();

  protected outputs: INodeOutput[] = [];

  protected form = new FormControl();

  protected readonly defaultParams = NODE_PARAMS_MAP;

  protected readonly isExpanded = signal(false);

  public ngOnInit(): void {
    this.form = new FormControl(this.viewModel()?.value);
    this.subscribeToFormChanges();

    effect(() => {
      const node = this.viewModel();
      this.isExpanded.set(!!node.isExpanded);
      this.outputs = (node.outputs || []).slice().reverse();
    }, {injector: this._injector});
  }

  private subscribeToFormChanges(): void {
    this.form.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
      this.valueChange.emit(value);
    });
  }

  protected toggle(): void {
    this.isExpanded.set(!this.isExpanded());
    this._state.update({
      nodes: {
        [this.viewModel().id]: {
          isExpanded: this.isExpanded()
        }
      }
    })
  }
}
