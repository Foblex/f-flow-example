import {
  ChangeDetectionStrategy,
  Component,
  effect, inject,
  Injector,
  input,
  OnInit,
  untracked
} from '@angular/core';
import {IconButtonComponent} from '@shared-components';
import {FFlowModule} from '@foblex/flow';
import {MatTooltip} from '@angular/material/tooltip';
import {IFlowState} from "../../models/i-flow-state";
import {IFlowStateNode} from "../../models/i-flow-state-node";
import {NODE_PARAMS_MAP} from "../../constants/node-params-map";
import {ENodeType} from "../../enums/e-node-type";

@Component({
  selector: 'workflow-palette',
  templateUrl: './workflow-palette.html',
  styleUrls: ['./workflow-palette.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconButtonComponent,
    FFlowModule,
    MatTooltip
  ]
})
export class WorkflowPalette implements OnInit {

  private readonly _injector = inject(Injector);

  public readonly viewModel = input.required<IFlowState>();

  protected readonly nodes = Object.keys(NODE_PARAMS_MAP).map((key: string) => {
    return {
      // @ts-ignore
      ...NODE_PARAMS_MAP[key],
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
      if (x.type === ENodeType.IncomingCall) {
        x.disabled = nodes.some((y) => y.type === ENodeType.IncomingCall);
      }
    });
  }
}
