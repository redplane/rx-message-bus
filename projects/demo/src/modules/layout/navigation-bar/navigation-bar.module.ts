import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {NavigationBarComponent} from './navigation-bar.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

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
