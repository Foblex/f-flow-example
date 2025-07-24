import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { EFlowActionPanelEvent } from './e-flow-action-panel-event';
import { IconButtonComponent } from '@shared-components';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'workflow-action-panel',
  templateUrl: './workflow-action-panel.component.html',
  styleUrls: [ './workflow-action-panel.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconButtonComponent,
    MatTooltip
  ]
})
export class WorkflowActionPanelComponent {

  protected eEventType = EFlowActionPanelEvent;

  @Output()
  private request: EventEmitter<EFlowActionPanelEvent> = new EventEmitter<EFlowActionPanelEvent>();

  public onClick(event: EFlowActionPanelEvent): void {
    this.request.emit(event);
  }
}
