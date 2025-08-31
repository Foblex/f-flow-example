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
import {FlowActionPanelAction} from './enums/flow-action-panel-action';
import {MatTooltip} from '@angular/material/tooltip';
import {FlowState} from "../../flow-state";
import {FlowApiService} from "../../providers/flow-api.service";
import {IFlowState} from "../../models/i-flow-state";
import {ThemeService} from "../../../../services/theme.service";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'flow-action-panel',
  templateUrl: './flow-action-panel.html',
  styleUrls: ['./flow-action-panel.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTooltip,
    MatIcon,
    MatIconButton,
    FormsModule,
    MatMenuTrigger,
    MatMenuItem,
    MatMenu,
  ]
})
export class FlowActionPanel implements OnInit {
  private readonly _injector = inject(Injector);
  private readonly _apiService = inject(FlowApiService);
  private readonly _themeService = inject(ThemeService);
  protected readonly state = inject(FlowState);

  protected get currentTheme() {
    return this._themeService.current;
  }

  public readonly processAction = output<FlowActionPanelAction>();
  public readonly resetFlow = output<void>();
  public readonly viewModel = input.required<IFlowState>();

  protected readonly action = FlowActionPanelAction;
  protected readonly canRemove = signal(false);

  public ngOnInit(): void {
    this._listenStateChanges();
  }

  private _listenStateChanges(): void {
    effect(() => {
      const model = this.viewModel();
      untracked(() => this.canRemove.set(this._calculateCanRemove(model)));
    }, {injector: this._injector});
  }

  private _calculateCanRemove(model: IFlowState): boolean {
    return (model.selection?.nodes || []).length > 0 || (model.selection?.connections || []).length > 0;
  }

  protected removeSelected(): void {
    this._apiService.removeSelected(this.viewModel());
  }

  protected toggleTheme(theme: 'light' | 'dark'): void {
    this._themeService.toggle(theme);
  }

  protected reset(): void {
    this.resetFlow.emit();
  }
}
