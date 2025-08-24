import {ChangeDetectionStrategy, Component} from '@angular/core';
import {WorkflowEditor} from "./editor";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WorkflowEditor,
  ]
})
export class App {
}
