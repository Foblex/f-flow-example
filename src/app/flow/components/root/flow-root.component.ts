import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlowExplorerPanelComponent } from '../explorer-panel/flow-explorer-panel.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'flow-root',
  templateUrl: './flow-root.component.html',
  styleUrls: [ './flow-root.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FlowExplorerPanelComponent,
    RouterOutlet
  ]
})
export class FlowRootComponent {

}
