import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DeleteMessageDemoComponent} from "./delete-message-demo.component";
import {NgRxMessageBusModule} from "../../../../../ngrx-message-bus/src/modules/ngrx-message-bus.module";

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
    NgRxMessageBusModule,
    RouterModule.forChild(routes)
  ]
})
export class DeleteMessageDemoRouteModule {

}

//#endregion
