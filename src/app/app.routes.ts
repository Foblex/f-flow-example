import { Routes } from '@angular/router';
import { MasterComponent } from './master/master.component';

export const routes: Routes = [ {
  path: '',
  component: MasterComponent,
  children: [ {
    path: 'flow',
    loadComponent: () => import('./flow/components/root/flow-root.component').then(m => m.FlowRootComponent),
    children: [ {
      path: ':key',
      loadComponent: () => import('./flow/components/editor/flow-editor.component').then(m => m.FlowEditorComponent)
    } ]
  } ]
} ];
