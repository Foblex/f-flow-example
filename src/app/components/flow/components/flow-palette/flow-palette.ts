import {
  ChangeDetectionStrategy,
  Component,
  effect, inject,
  Injector,
  input,
  OnInit,
  untracked
} from '@angular/core';
import {FFlowModule} from '@foblex/flow';
import {MatTooltip} from '@angular/material/tooltip';
import {IFlowState} from "../../models/i-flow-state";
import {IFlowStateNode} from "../../models/i-flow-state-node";
import {NODE_PARAMS_MAP} from "../../constants/node-params-map";
import {NodeType} from "../../enums/node-type";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'flow-palette',
  templateUrl: './flow-palette.html',
  styleUrls: ['./flow-palette.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
    MatTooltip,
    MatIcon,
    MatIconButton,
  ]
})
export class FlowPalette implements OnInit {
  private readonly _injector = inject(Injector);

  public readonly viewModel = input.required<IFlowState>();

  protected readonly nodes = Object.entries(NODE_PARAMS_MAP).map(([key, data]) => {
    return {
      ...data,
      type: key,
      disabled: false
    }
  });

  public ngOnInit(): void {
    effect(() => {
      const viewModel = this.viewModel();
      untracked(() => this._limitNodes(Object.values(viewModel.nodes)));
    }, {injector: this._injector});
  }

  private _limitNodes(nodes: IFlowStateNode[]): void {
    this.nodes.forEach((x) => {
      if (x.type === NodeType.IncomingCall) {
        x.disabled = nodes.some((y) => y.type === NodeType.IncomingCall);
      }
    });
  }
}
