import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RpcDemoComponent} from './rpc-demo.component';

const routes: Routes = [
  {
    path: '',
    component: RpcDemoComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RpcDemoRouteModule {

}
