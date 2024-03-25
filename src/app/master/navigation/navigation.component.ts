import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { IKeyNameModel } from '@infrastructure';

interface INavigationItem extends IKeyNameModel<string> {
  icon: string;
  disabled: boolean;
}

@Component({
  selector: 'nav[navigation]',
  templateUrl: './navigation.component.html',
  styleUrls: [ './navigation.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    RouterLink,
    RouterLinkActive
  ]
})
export class NavigationComponent {

  public menu: INavigationItem[] = [
    {
      key: 'home',
      name: 'Home',
      icon: 'home',
      disabled: true,
    }, {
      key: 'flow',
      name: 'Flow',
      icon: 'timeline',
      disabled: false,
    }, {
      key: 'form-builder',
      name: 'Form Builder',
      icon: 'build',
      disabled: true,
    }, {
      key: 'master',
      name: 'Master',
      icon: 'list',
      disabled: true,
    }
  ];

}
