import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { IconButtonComponent } from '@shared-components';
import { FFlowModule } from '@foblex/flow';
import { MatTooltip } from '@angular/material/tooltip';
import { ENodeType } from '@domain';
import { IFlowViewModel, NODE_STATIC_MAP } from '../../../domain';

@Component({
  selector: 'workflow-palette',
  templateUrl: './workflow-palette.component.html',
  styleUrls: [ './workflow-palette.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    IconButtonComponent,
    FFlowModule,
    MatTooltip
  ]
})
export class WorkflowPaletteComponent implements OnChanges {

  @Input({ required: true })
  public viewModel!: IFlowViewModel;

  protected nodes = Object.keys(NODE_STATIC_MAP).map((key: string) => {
    return {
      ...NODE_STATIC_MAP[ key ],
      type: key,
      disabled: false
    }
  });

  public ngOnChanges(): void {
    this.limitNodes();
  }

  private limitNodes(): void {
    this.nodes.forEach((x) => {
      if (x.type === ENodeType.IncomingCall) {
        x.disabled = this.viewModel.nodes.some((y) => y.type === ENodeType.IncomingCall);
      }
    });
  }
}
