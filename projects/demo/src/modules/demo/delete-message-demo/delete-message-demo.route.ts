import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeleteMessageDemoComponent} from './delete-message-demo.component';
import {MessageBusModule} from '@message-bus/core';

//#region Routes

const routes: Routes = [
  {
    path: '',
    component: DeleteMessageDemoComponent
  }
];

//#endregion

//#region Module declaration

@NgModule({
  imports: [
    MessageBusModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class DeleteMessageDemoRouteModule {

}

//#endregion
