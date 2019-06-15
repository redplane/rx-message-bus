import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HookChannelEventDemoComponent} from "./hook-channel-event-demo.component";

//#region Routes

const routes: Routes = [
  {
    path: '',
    component: HookChannelEventDemoComponent
  }
];

//#endregion

//#region Module declaration

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class HookChannelEventDemoRouteModule {

}

//#endregion
