import {NgModule} from "@angular/core";
import {SideBarModule} from "./side-bar/side-bar.module";
import {NavigationBarModule} from "./navigation-bar/navigation-bar.module";

//#region Module

@NgModule({
  imports: [
    NavigationBarModule,
    SideBarModule
  ],
  exports: [
    NavigationBarModule,
    SideBarModule
  ]
})
export class LayoutModule {

}

//#endregion
