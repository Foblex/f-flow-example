import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector, input,
  OnInit,
  output,
  signal,
  untracked
} from '@angular/core';
import {EFlowActionPanelEvent} from './e-flow-action-panel-event';
import {IconButtonComponent} from '@shared-components';
import {MatTooltip} from '@angular/material/tooltip';
import {FlowState} from "../../flow-state";
import {FlowApiService} from "../../providers/flow-api.service";
import {IFlowState} from "../../models/i-flow-state";

@Component({
  selector: 'workflow-action-panel',
  templateUrl: './workflow-action-panel.html',
  styleUrls: ['./workflow-action-panel.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconButtonComponent,
    MatTooltip
  ]
})
export class WorkflowActionPanel implements OnInit {

  private readonly _injector = inject(Injector);
  private readonly _apiService = inject(FlowApiService);

  protected readonly state = inject(FlowState);

  public viewModel = input.required<IFlowState>();

  public readonly action = output<EFlowActionPanelEvent>();

  protected readonly eEventType = EFlowActionPanelEvent;

  protected readonly canRemove = signal(false);

  public ngOnInit(): void {
    this._listenStateChanges();
  }

  private _listenStateChanges(): void {
    effect(() => {
      const model = this.viewModel();
      untracked(() => {
        this.canRemove.set((model.selection?.nodes || []).length > 0 || (model.selection?.connections || []).length > 0);
      });
    }, {injector: this._injector});
  }

  protected removeSelected(): void {
    this._apiService.removeSelected(this.viewModel());
  }
}
