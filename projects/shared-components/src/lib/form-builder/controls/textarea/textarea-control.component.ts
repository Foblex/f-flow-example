import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { IBuilderValueControlViewModel } from '../../domain/i-builder-value-control-view-model';

@Component({
  selector: 'textarea-control',
  templateUrl: './textarea-control.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule
  ]
})
export class TextareaControlComponent {

  @Input({ required: true })
  public viewModel!: IBuilderValueControlViewModel;
}
