import {NgModule} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {SideBarComponent} from "./side-bar.component";
import {MatIconModule, MatListModule} from "@angular/material";
import {RouterModule} from "@angular/router";

//#region Module

@NgModule({
  imports: [
    MatListModule,
    MatIconModule,
    RouterModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SideBarComponent
  ],
  exports: [
    SideBarComponent
  ]
})
export class SideBarModule {

}

//#endregion
