import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'master',
  templateUrl: './master.component.html',
  styleUrls: [ './master.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    NavigationComponent,
    HeaderComponent
  ]
})
export class MasterComponent {

}
