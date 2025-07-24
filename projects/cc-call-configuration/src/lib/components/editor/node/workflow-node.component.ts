import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {EFConnectableSide, FFlowModule} from '@foblex/flow';
import {MatIcon} from '@angular/material/icon';
import {FormBuilderDirective} from '@shared-components';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';
import {INodeValueModel} from '@domain';
import {INodeViewModel} from '../../../domain';

@Component({
  selector: 'workflow-node',
  templateUrl: './workflow-node.component.html',
  styleUrls: ['./workflow-node.component.scss'],
  standalone: true,
  imports: [
    FFlowModule,
    MatIcon,
    FormBuilderDirective,
    ReactiveFormsModule
  ],
  host: {
    '[style.border-top-color]': 'model.color',
  }
})
export class WorkflowNodeComponent implements OnInit, OnChanges, OnDestroy {

  private subscription$: Subscription = Subscription.EMPTY;

  @Output()
  public valueChange: EventEmitter<INodeValueModel> = new EventEmitter<INodeValueModel>();

  @Output()
  public removeConnection: EventEmitter<string> = new EventEmitter<string>();

  @Input({required: true})
  public model!: INodeViewModel;

  public isBodyVisible: boolean = false;

  public eFConnectableSide = EFConnectableSide;

  public outputs: {
    key: string;
    name: string;
  }[] = [];

  public form: FormControl = new FormControl();

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.form = new FormControl(this.model?.value);
    this.isBodyVisible = this.model?.isExpanded || false;
    this.subscription$ = this.subscribeToFormChanges();
  }

  private subscribeToFormChanges(): Subscription {
    return this.form.valueChanges.subscribe((value) => {
      this.valueChange.emit(value);
      setTimeout(() => {
        this.outputs = (this.model?.outputs || []).slice().reverse();
      });
    });
  }

  public ngOnChanges(): void {
    this.outputs = (this.model?.outputs || []).slice().reverse();
  }

  public onRemoveConnection(key: string): void {
    this.removeConnection.emit(key);
  }

  public onToggleBodyClick(): void {
    this.isBodyVisible = !this.isBodyVisible;
    this.model.isExpanded = this.isBodyVisible;
    this.changeDetectorRef.markForCheck();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
