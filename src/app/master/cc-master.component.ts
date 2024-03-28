import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CcNavigationComponent } from './navigation/cc-navigation.component';
import { CcHeaderComponent } from './header/cc-header.component';

@Component({
  selector: 'cc-master',
  templateUrl: './cc-master.component.html',
  styleUrls: [ './cc-master.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    CcNavigationComponent,
    CcHeaderComponent
  ]
})
export class CcMasterComponent {

}
