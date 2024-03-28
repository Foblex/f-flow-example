import { Routes } from '@angular/router';
import { CcMasterComponent } from './master/cc-master.component';

export const routes: Routes = [ {
  path: '',
  component: CcMasterComponent,
  children: [ {
    path: 'flow',
    loadComponent: () => import('@cc-call-configuration').then(m => m.CcCallWorkflowComponent),
    children: [ {
      path: ':key',
      loadComponent: () => import('@cc-call-configuration').then(m => m.WorkflowEditorComponent)
    } ]
  } ]
} ];
