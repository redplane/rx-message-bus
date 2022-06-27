import {NgModule} from '@angular/core';
import {DemoRouteModule} from './demo.route';
import {RouterModule} from '@angular/router';
import {DemoComponent} from './demo.component';

@NgModule({
  imports: [
    DemoRouteModule
  ],
  declarations: [
    DemoComponent
  ],
  exports: [
    DemoComponent,
    RouterModule
  ]
})
export class DemoModule {

}
