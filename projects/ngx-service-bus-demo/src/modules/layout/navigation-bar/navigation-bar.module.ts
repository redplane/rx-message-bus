import {NgModule} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {NavigationBarComponent} from "./navigation-bar.component";
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatToolbarModule
} from "@angular/material";

//#region Module

@NgModule({
  imports: [
    MatFormFieldModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    TranslateModule.forChild()
  ],
  declarations: [
    NavigationBarComponent
  ],
  exports: [
    NavigationBarComponent
  ]
})
export class NavigationBarModule {

}

//#endregion
