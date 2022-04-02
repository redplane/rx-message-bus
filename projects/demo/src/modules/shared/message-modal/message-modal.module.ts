import {NgModule} from '@angular/core';
import {MessageModalComponent} from './message-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MessageModalService} from './message-modal.service';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [
    MessageModalComponent
  ],
  exports: [
    MessageModalComponent
  ],
  providers: [
    MessageModalService
  ]
})
export class MessageModalModule {
}
