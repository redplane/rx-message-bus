import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SkipHistoricalMessageDemoComponent} from './skip-historical-message-demo.component';

const routes: Routes = [
  {
    path: '',
    component: SkipHistoricalMessageDemoComponent
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
export class SkipHistoricalMessageDemoRoutingModule {

}
