import {
  Component, OnInit
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {WorkflowEditorComponent} from "@cc-call-configuration";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  imports: [
    RouterOutlet,
    WorkflowEditorComponent,
  ]
})
export class App {

}
