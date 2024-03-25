import {
  ChangeDetectionStrategy,
  Component, Input,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'button[icon-button]',
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon
  ]
})
export class IconButtonComponent {

}
