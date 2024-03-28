import { Directive, forwardRef, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  FormBuilderModelFromValueRequest
} from './domain/view-model-from-value/form-builder-model-from-value-request';
import { IBuilderValueViewModel } from './domain/i-builder-value-view-model';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IFormBuilderValue } from './domain/external-value';
import { FormBuilderModelFromValueHandler } from './domain/view-model-from-value/form-builder-model-from-value-handler';
import { IBuilderValueGroupViewModel } from './domain/i-builder-value-group-view-model';
import { GroupControlComponent } from './controls/group/group-control.component';
import { ValueFromFormBuilderModelHandler } from './domain/value-from-form-value/value-from-form-builder-model-handler';
import { ValueFromFormBuilderModelRequest } from './domain/value-from-form-value/value-from-form-builder-model-request';

@Directive({
  selector: '[formBuilder]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormBuilderDirective),
      multi: true
    }
  ],
})
export class FormBuilderDirective implements OnInit, OnDestroy, ControlValueAccessor {

  private subscription$: Subscription = Subscription.EMPTY;

  private _value: IFormBuilderValue | null = null;

  @Input()
  public set value(value: IFormBuilderValue | null) {
    if (this._value !== value) {
      this.rebuild(value);
    }
    this._value = value;
  }

  public get value(): IFormBuilderValue | null {
    return this._value;
  }

  private viewModel: IBuilderValueViewModel | undefined;

  private onChange: any = () => {
  };
  private onTouch: any = () => {
  };

  constructor(
    private container: ViewContainerRef
  ) {
  }

  public ngOnInit(): void {
    this.rebuild(this._value);
  }

  private rebuild(value: IFormBuilderValue | null): void {
    const viewModel = new FormBuilderModelFromValueHandler().handle(
      new FormBuilderModelFromValueRequest(value)
    );
    this.viewModel = viewModel;

    this.subscription$.unsubscribe();
    this.subscription$ = this.subscribeOnFormChanges(viewModel);

    this.render(viewModel.groups);
  }

  private render(groups: IBuilderValueGroupViewModel[]): void {
    this.dispose();
    groups.forEach((x) => {

      const groupComponent = this.container.createComponent(GroupControlComponent);
      groupComponent.instance.render(x);
    });
  }

  private subscribeOnFormChanges(viewModel: IBuilderValueViewModel): Subscription {
    return viewModel.form.valueChanges.subscribe(() => {
      const value = new ValueFromFormBuilderModelHandler().handle(
        new ValueFromFormBuilderModelRequest(viewModel)
      );

      this.onChange(value);
      this.onTouch();
    });
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  public writeValue(value: IFormBuilderValue | null): void {
    if (value !== this.value) {
      this.value = value;
    }
  }

  public dispose(): void {
    this.container.clear();
  }

  public ngOnDestroy(): void {
    this.dispose();
    this.subscription$.unsubscribe();
  }
}
