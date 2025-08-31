import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Flow} from "./components/flow";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Flow,
  ]
})
export class App {
}
