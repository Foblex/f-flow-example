import {
  Component,
  input, output,
} from '@angular/core';
import {FFlowModule} from '@foblex/flow';
import {MatIcon} from '@angular/material/icon';
import {INodeOutput} from "../../../models/i-flow-state-node";

@Component({
  selector: 'flow-node-body-outputs',
  templateUrl: './flow-node-body-outputs.html',
  styleUrls: ['./flow-node-body-outputs.scss'],
  standalone: true,
  imports: [
    FFlowModule,
    MatIcon,
  ]
})
export class FlowNodeBodyOutputs {
  public readonly removeConnection = output<string>();

  public readonly outputs = input.required<INodeOutput[]>();
}
