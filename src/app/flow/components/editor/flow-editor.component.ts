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
  FCellPatternComponent, FConnectionCenterDirective,
  FCreateConnectionEvent, FCreateNodeEvent,
  FFlowComponent,
  FFlowModule,
  FMarkerDirective,
  FReassignConnectionEvent, FZoomDirective
} from '@foblex/flow';
import { IPoint, MouseEventExtensions, Point } from '@foblex/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { IFlowViewModel } from '../../domain/i-flow-view-model';
import { INodeViewModel } from '../../domain/i-node-view-model';
import { FlowActionPanelComponent } from './action-panel/flow-action-panel.component';
import { Store } from '@ngxs/store';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EFlowActionPanelEvent } from './action-panel/e-flow-action-panel-event';
import { FlowPaletteComponent } from './palette/flow-palette.component';
import { distinctUntilChanged, filter, map, merge, Observable, startWith, Subject, Subscription, take } from 'rxjs';
import { FlowNodeComponent } from './node/flow-node.component';
import { DetailsFlowHandler } from '../../domain/details/details-flow-handler';
import { DetailsFlowRequest } from '../../domain/details/details-flow-request';
import { ReassignConnectionHandler } from '../../domain/reassign-connection/reassign-connection-handler';
import { ReassignConnectionRequest } from '../../domain/reassign-connection/reassign-connection-request';
import { CreateConnectionHandler } from '../../domain/create-connection/create-connection-handler';
import { CreateConnectionRequest } from '../../domain/create-connection/create-connection-request';
import { TestCallHandler } from '../../domain/test-call/test-call-handler';
import { TestCallRequest } from '../../domain/test-call/test-call-request';
import { BulkRemoveHandler } from '../../domain/bulk-remove/bulk-remove-handler';
import { BulkRemoveRequest } from '../../domain/bulk-remove/bulk-remove-request';
import { A, BACKSPACE, DASH, DELETE, NUMPAD_MINUS, NUMPAD_PLUS } from '@angular/cdk/keycodes';
import { ChangeNodePositionAction, CreateNodeAction, INodeValueModel } from '@domain';
import { ChangeNodeRequest } from '../../domain/node/change/change-node-request';
import { ChangeNodeHandler } from '../../domain/node/change/change-node-handler';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { generateId, IKeyNameModel } from '@infrastructure';
import { FormsModule } from '@angular/forms';
import { IConnectionViewModel } from '../../domain/i-connection-view-model';

@Component({
  selector: 'flow-editor',
  templateUrl: './flow-editor.component.html',
  styleUrls: [ './flow-editor.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
    FlowNodeComponent,
    MatIcon,
    MatIconButton,
    FlowActionPanelComponent,
    FlowPaletteComponent,
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
export class FlowEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscriptions$: Subscription = new Subscription();

  public viewModel: IFlowViewModel | undefined;

  @ViewChild(FFlowComponent, { static: false })
  public fFlowComponent!: FFlowComponent;

  @ViewChild(FCanvasComponent, { static: false })
  public fCanvasComponent!: FCanvasComponent;

  @ViewChild(FZoomDirective, { static: false })
  public fZoomDirective!: FZoomDirective;

  public eMarkerType = EFMarkerType;

  public eConnectionBehaviour = EFConnectionBehavior;

  public eConnectionType = EFConnectionType;

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

  protected cTypes: IKeyNameModel[] = Object.keys(EFConnectionType).map((x, index) => {
    return {
      key: Object.values(EFConnectionType)[ index ],
      name: x
    };
  });

  protected cBehaviors: IKeyNameModel[] = Object.keys(EFConnectionBehavior).map((x, index) => {
    return {
      key: Object.values(EFConnectionBehavior)[ index ],
      name: x
    };
  });

  constructor(
    private store: Store,
    private router: Router,
    private injector: Injector,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
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

  public onChangeConnections(): void {
    const viewModel = JSON.parse(JSON.stringify(this.viewModel));
    viewModel.connections.forEach((x: IConnectionViewModel) => {
      x.key = generateId('connection');
    });
    this.viewModel = viewModel;

    this.changeDetectorRef.detectChanges();
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
        if (MouseEventExtensions.isCommandButton(event)) {
          this.fZoomDirective.zoomIn();
        }
        break;
      case NUMPAD_MINUS:
      case DASH:
        if (MouseEventExtensions.isCommandButton(event)) {
          this.fZoomDirective.zoomOut();
        }
        break;
      case A:
        if (MouseEventExtensions.isCommandButton(event)) {
          this.fFlowComponent.selectAll()
        }
        break;
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
