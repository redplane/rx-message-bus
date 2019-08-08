import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DemoComponent} from "./demo.component";

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
        loadChildren: './module-level-demo/module-level-demo.module#ModuleLevelDemoModule'
      },
      {
        path: 'component-level',
        loadChildren: './component-level-demo/component-level-demo.module#ComponentLevelDemoModule'
      },
      {
        path: 'delete-message',
        loadChildren: './delete-message-demo/delete-message-demo.module#DeleteMessageDemoModule'
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
