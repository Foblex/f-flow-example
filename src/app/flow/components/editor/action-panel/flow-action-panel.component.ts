import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { EFlowActionPanelEvent } from './e-flow-action-panel-event';
import { IconButtonComponent } from '@shared-components';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'flow-action-panel',
  templateUrl: './flow-action-panel.component.html',
  styleUrls: [ './flow-action-panel.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    IconButtonComponent,
    MatTooltip
  ]
})
export class FlowActionPanelComponent {

  protected eEventType = EFlowActionPanelEvent;

  @Output()
  private action: EventEmitter<EFlowActionPanelEvent> = new EventEmitter<EFlowActionPanelEvent>();

  public onClick(event: EFlowActionPanelEvent): void {
    this.action.emit(event);
  }
}
