import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { IBuilderValueControlViewModel } from '../../domain/i-builder-value-control-view-model';

@Component({
  selector: 'input-control',
  templateUrl: './input-control.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule
  ]
})
export class InputControlComponent {

  @Input({ required: true })
  public viewModel!: IBuilderValueControlViewModel;
}
