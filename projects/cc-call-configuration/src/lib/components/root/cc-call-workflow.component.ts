import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkflowListComponent } from '../workflow-list/workflow-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cc-call-workflow',
  templateUrl: './cc-call-workflow.component.html',
  styleUrls: [ './cc-call-workflow.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WorkflowListComponent,
    RouterOutlet
  ]
})
export class CcCallWorkflowComponent {

}
