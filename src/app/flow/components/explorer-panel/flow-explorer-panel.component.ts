import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  filter,
  Observable, of, startWith,
  Subscription,
  switchMap,
  take
} from 'rxjs';
import { generateId, IKeyNameModel } from '@infrastructure';
import { CreateFlowAction, RemoveFlowAction, FlowState } from '@domain';
import { AsyncPipe } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { IconButtonComponent } from '@shared-components';

const entityName = 'flow';

@Component({
  selector: 'flow-explorer-panel',
  templateUrl: './flow-explorer-panel.component.html',
  styleUrls: [ './flow-explorer-panel.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    MatIcon,
    IconButtonComponent
  ]
})
export class FlowExplorerPanelComponent implements OnInit, OnDestroy {

  private subscriptions$: Subscription = new Subscription();

  public searchControl = new FormControl('');

  private entities: IKeyNameModel[] = [];

  public entities$: Observable<IKeyNameModel[]> = this.searchControl.valueChanges.pipe(
    startWith(''), switchMap((search) => {
      return of(this.entities.filter(entity => entity.name.toLowerCase().includes(search?.toLowerCase() || '')));
    })
  )

  constructor(
    private store: Store,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    this.getData();

    this.subscriptions$.add(this.subscribeOnRouteChanges());
  }

  private getData(): void {
    const entities = this.store.selectSnapshot(FlowState.summaryList).reverse();
    if (!entities || !entities.length) {
      this.onCreate();
    } else {
      this.entities = entities;
      this.filterEntities();
    }
  }

  private filterEntities(): void {
    this.searchControl.setValue(this.searchControl.value);
  }

  private subscribeOnRouteChanges(): Subscription {
    return this.router.events.pipe(
      startWith(new NavigationEnd(1, '', '')), filter((x) => x instanceof NavigationEnd)
    ).subscribe(() => {
      const isFlowKey = this.router.url.split('/').pop()?.toLowerCase() !== entityName;
      if (!isFlowKey) {
        this.toDefaultFlow();
      } else {
        this.filterEntities();
      }
    });
  }

  private toDefaultFlow(): void {
    if (this.entities.length > 0) {
      this.navigateToEntity(this.entities[ 0 ].key);
    }
  }

  public onCreate(): void {
    const key = generateId(entityName);
    this.store.dispatch(new CreateFlowAction(key, entityName + Date.now())).pipe(take(1)).subscribe(() => {
      this.navigateToEntity(key);
      this.getData();
    });
  }

  public onDelete(entity: IKeyNameModel, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.store.dispatch(new RemoveFlowAction(entity.key)).pipe(take(1)).subscribe(() => {
      if (entity.key === this.router.url.split('/').pop()) {
        this.toDefaultFlow();
      }
      this.getData();
    });
  }

  private navigateToEntity(key: string): void {
    this.router.navigateByUrl(`/${entityName}/` + key);
  }

  public ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
