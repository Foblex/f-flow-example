import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'header[header]',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    NgOptimizedImage
  ]
})
export class HeaderComponent {
}
