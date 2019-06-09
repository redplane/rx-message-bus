import {NgModule} from "@angular/core";
import {MainRouteModule} from "./main.route";
import {MainComponent} from "./main.component";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    MainRouteModule
  ],
  declarations: [
    MainComponent
  ],
  exports: [
    MainComponent,

    RouterModule
  ]
})
export class MainModule {

}
