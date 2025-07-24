import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatOption} from '@angular/material/autocomplete';
import {MatSelect} from '@angular/material/select';
import {IBuilderValueControlViewModel} from '../../domain/i-builder-value-control-view-model';

@Component({
  selector: 'outputs-select-control',
  templateUrl: './outputs-select-control.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatOption,
    MatSelect
  ]
})
export class OutputsSelectControlComponent {

  @Input({required: true})
  public viewModel!: IBuilderValueControlViewModel;

  protected options: {
    key: number,
    name: string
  }[] = [{
    key: 1,
    name: '1'
  }, {
    key: 2,
    name: '2'
  }, {
    key: 3,
    name: '3'
  }, {
    key: 4,
    name: '4'
  }, {
    key: 5,
    name: '5'
  }, {
    key: 6,
    name: '6'
  }, {
    key: 7,
    name: '7'
  }, {
    key: 8,
    name: '8'
  }, {
    key: 9,
    name: '9'
  }];
}
