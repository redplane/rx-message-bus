import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DemoComponent} from './demo.component';

//#region Properties

const routes: Routes = [
  {
    path: '',
    component: DemoComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'module-level'
      },
      {
        path: 'module-level',
        loadChildren: () => import('./module-level-demo/module-level-demo.module').then(m => m.ModuleLevelDemoModule)
      },
      {
        path: 'component-level',
        loadChildren: () => import('./component-level-demo/component-level-demo.module').then(m => m.ComponentLevelDemoModule)
      },
      {
        path: 'delete-message',
        loadChildren: () => import('./delete-message-demo/delete-message-demo.module').then(m => m.DeleteMessageDemoModule)
      }
    ]
  }
];

//#endregion

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class DemoRouteModule {

}
