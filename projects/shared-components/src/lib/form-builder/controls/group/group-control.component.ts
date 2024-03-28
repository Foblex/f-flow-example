import { ChangeDetectionStrategy, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FORM_BUILDER_CONTROL_MAP } from '../../domain/form-builder-control-map';
import { NgIf } from '@angular/common';
import { IBuilderValueGroupViewModel } from '../../domain/i-builder-value-group-view-model';

@Component({
  selector: 'group-control',
  templateUrl: './group-control.component.html',
  styleUrls: [ './group-control.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf
  ]
})
export class GroupControlComponent {

  @ViewChild('containerRef', { static: true, read: ViewContainerRef })
  public viewContainer: ViewContainerRef | undefined;

  public viewModel: IBuilderValueGroupViewModel | undefined;

  public render(model: IBuilderValueGroupViewModel): void {
    this.viewModel = model;

    if (!this.viewContainer) {
      throw new Error('View container not found ' + model.name);
    }
    this.viewContainer.clear();

    model.controls.forEach((control) => {
      const component = this.viewContainer!.createComponent(FORM_BUILDER_CONTROL_MAP[ control.type ]);
      component.instance.viewModel = control;
    });
  }
}
