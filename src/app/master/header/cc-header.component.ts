import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'header[cc-header]',
  templateUrl: './cc-header.component.html',
  styleUrls: [ './cc-header.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    NgOptimizedImage
  ]
})
export class CcHeaderComponent {

  public onGitHubClick(): void {
    window.open('https://github.com/Foblex/f-flow-example', '_blank');
  }
}
