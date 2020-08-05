import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {SideBarComponent} from './side-bar.component';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';

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
