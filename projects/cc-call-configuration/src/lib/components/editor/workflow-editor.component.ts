import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, Injector, OnDestroy, OnInit,
  ViewChild,
} from '@angular/core';
import {
  EFConnectableSide, EFConnectionBehavior,
  EFConnectionType,
  EFMarkerType,
  FCanvasComponent,
  FCreateConnectionEvent, FCreateNodeEvent,
  FFlowComponent,
  FFlowModule,
  FReassignConnectionEvent, FZoomDirective,
} from '@foblex/flow';
import { IPoint, MouseEventExtensions, Point } from '@foblex/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { WorkflowNodeComponent } from './node/workflow-node.component';
import { WorkflowActionPanelComponent } from './action-panel/workflow-action-panel.component';
import { WorkflowPaletteComponent } from './palette/workflow-palette.component';
import { distinctUntilChanged, filter, map, merge, Observable, startWith, Subject, Subscription, take } from 'rxjs';
import {
  BulkRemoveHandler, BulkRemoveRequest, ChangeNodeHandler, ChangeNodeRequest,
  CreateConnectionHandler, CreateConnectionRequest,
  DetailsFlowHandler,
  DetailsFlowRequest,
  IFlowViewModel,
  INodeViewModel, ReassignConnectionHandler, ReassignConnectionRequest, TestCallHandler, TestCallRequest
} from '../../domain';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ChangeNodePositionAction, CreateNodeAction, INodeValueModel } from '@domain';
import { EFlowActionPanelEvent } from './action-panel/e-flow-action-panel-event';
import { A, BACKSPACE, DASH, DELETE, NUMPAD_MINUS, NUMPAD_PLUS } from '@angular/cdk/keycodes';
import { BrowserService, EOperationSystem, PlatformService } from '@foblex/platform';

@Component({
  selector: 'workflow-editor',
  templateUrl: './workflow-editor.component.html',
  styleUrls: [ './workflow-editor.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
    WorkflowNodeComponent,
    MatIcon,
    MatIconButton,
    WorkflowActionPanelComponent,
    WorkflowPaletteComponent,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    FormsModule
  ],
  host: {
    '(keydown)': 'onKeyDown($event)',
    'tabindex': '-1'
  }
})
export class WorkflowEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscriptions$: Subscription = new Subscription();

  public viewModel: IFlowViewModel | undefined;

  @ViewChild(FFlowComponent, { static: false })
  public fFlowComponent!: FFlowComponent;

  @ViewChild(FCanvasComponent, { static: false })
  public fCanvasComponent!: FCanvasComponent;

  @ViewChild(FZoomDirective, { static: false })
  public fZoomDirective!: FZoomDirective;

  public eMarkerType = EFMarkerType;

  public eConnectableSide = EFConnectableSide;

  public cBehavior: EFConnectionBehavior = EFConnectionBehavior.FIXED;

  public cType: EFConnectionType = EFConnectionType.SEGMENT;

  private hasChanges$: Subject<void> = new Subject<void>();

  private get routeKeyChange$(): Observable<boolean> {
    return this.router.events.pipe(
      startWith(new NavigationEnd(0, '', '')),
      filter((x) => x instanceof NavigationEnd), map(() => this.activatedRoute.snapshot.params[ 'key' ]), distinctUntilChanged(),
      map(() => true)
    );
  }

  constructor(
    private store: Store,
    private router: Router,
    private injector: Injector,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private fPlatform: PlatformService
  ) {
  }

  public ngOnInit(): void {
    this.subscriptions$.add(this.subscribeReloadEvents());
  }

  private subscribeReloadEvents(): Subscription {
    return merge(this.hasChanges$, this.routeKeyChange$).subscribe((res) => {
      const key = this.activatedRoute.snapshot.params[ 'key' ];
      try {
        this.viewModel = this.injector.get(DetailsFlowHandler).handle(
          new DetailsFlowRequest(key)
        );
      } catch (e) {
        console.error(e);
        this.viewModel = undefined;
      }

      if (res) {
        this.fFlowComponent?.reset();
      }

      this.changeDetectorRef.detectChanges();
    });
  }

  public ngAfterViewInit(): void {
    this.onLoaded();
  }

  public onLoaded(): void {
    this.fCanvasComponent?.fitToScreen(new Point(300, 300), false);
  }

  public onCreateNode(event: FCreateNodeEvent): void {
    this.store.dispatch(
      new CreateNodeAction(this.viewModel!.key, event.data, event.rect)
    ).pipe(take(1)).subscribe((x) => {
      this.hasChanges$.next();
    });
  }

  public onNodePositionChanged(point: IPoint, node: INodeViewModel): void {
    node.position = point;
    this.store.dispatch(new ChangeNodePositionAction(this.viewModel!.key, node.key, point));
  }

  public onCreateConnection(event: FCreateConnectionEvent): void {
    if (!event.fInputId) {
      return;
    }
    this.viewModel = this.injector.get(CreateConnectionHandler).handle(
      new CreateConnectionRequest(this.viewModel!, event.fOutputId, event.fInputId)
    );
    this.changeDetectorRef.detectChanges();
  }

  public onReassignConnection(event: FReassignConnectionEvent): void {
    this.viewModel = this.injector.get(ReassignConnectionHandler).handle(
      new ReassignConnectionRequest(this.viewModel!, event.fOutputId, event.oldFInputId, event.newFInputId)
    );
    this.changeDetectorRef.detectChanges();
  }

  public onRemoveConnection(outputKey: string): void {
    const connection = this.viewModel!.connections.find((x) => x.from === outputKey);

    this.viewModel = this.injector.get(BulkRemoveHandler).handle(
      new BulkRemoveRequest(this.viewModel!, [], [ connection!.key ])
    );
    this.changeDetectorRef.detectChanges();
  }

  public onRemoveItems(): void {
    const selection = this.fFlowComponent.getSelection();
    this.viewModel = this.injector.get(BulkRemoveHandler).handle(
      new BulkRemoveRequest(this.viewModel!, selection.nodes, selection.connections)
    );
    this.changeDetectorRef.detectChanges();
  }

  public onValueChanged(node: INodeViewModel, value: INodeValueModel): void {
    const selected = this.fFlowComponent.getSelection();
    node.value = value;
    this.viewModel = this.injector.get(ChangeNodeHandler).handle(
      new ChangeNodeRequest(this.viewModel!, node)
    );

    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.fFlowComponent.select(selected.nodes, selected.connections);
    });
  }

  public onActionPanelEvent(event: EFlowActionPanelEvent): void {
    switch (event) {
      case EFlowActionPanelEvent.TEST_CALL:
        this.injector.get(TestCallHandler).handle(new TestCallRequest(this.viewModel!));
        break;
      case EFlowActionPanelEvent.DELETE_SELECTED:
        this.onRemoveItems();
        break;
      case EFlowActionPanelEvent.SELECT_ALL:
        this.fFlowComponent.selectAll();
        break;
      case EFlowActionPanelEvent.ZOOM_IN:
        this.fZoomDirective.zoomIn();
        break;
      case EFlowActionPanelEvent.ZOOM_OUT:
        this.fZoomDirective.zoomOut();
        break;
      case EFlowActionPanelEvent.FIT_TO_SCREEN:
        this.fCanvasComponent.fitToScreen();
        break;
      case EFlowActionPanelEvent.ONE_TO_ONE:
        this.fCanvasComponent.oneToOne();
        break;
    }
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }
    switch (event.keyCode) {
      case BACKSPACE:
      case DELETE:
        this.onRemoveItems();
        break;
      case NUMPAD_PLUS:
        if (MouseEventExtensions.isCommandButton(this.fPlatform.getOS() as EOperationSystem, event)) {
          this.fZoomDirective.zoomIn();
        }
        break;
      case NUMPAD_MINUS:
      case DASH:
        if (MouseEventExtensions.isCommandButton(this.fPlatform.getOS() as EOperationSystem, event)) {
          this.fZoomDirective.zoomOut();
        }
        break;
      case A:
        if (MouseEventExtensions.isCommandButton(this.fPlatform.getOS() as EOperationSystem, event)) {
          this.fFlowComponent.selectAll();
        }
        break;
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
