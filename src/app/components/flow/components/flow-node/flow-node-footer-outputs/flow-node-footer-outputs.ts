import {
  Component,
  input, output,
} from '@angular/core';
import {FFlowModule} from '@foblex/flow';
import {MatIcon} from '@angular/material/icon';
import {INodeOutput} from "../../../models/i-flow-state-node";

@Component({
  selector: 'flow-node-footer-outputs',
  templateUrl: './flow-node-footer-outputs.html',
  styleUrls: ['./flow-node-footer-outputs.scss'],
  standalone: true,
  imports: [
    FFlowModule,
    MatIcon,
  ]
})
export class FlowNodeFooterOutputs {
  public readonly removeConnection = output<string>();

  public readonly outputs = input.required<INodeOutput[]>();
}
