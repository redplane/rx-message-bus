import {Injectable, Injector} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {MessageModalComponent} from './message-modal.component';
import {ModalOptions} from './modal-options';

@Injectable()
export class MessageModalService {

  //#region Constructor

  public constructor(protected readonly _injector: Injector) {
  }

  //#endregion

  //#region Methods

  public displayAsync(message: string, title?: string): Observable<void> {

    const options = new ModalOptions();
    options.title = title;
    options.content = message;

    const dialog = this._injector.get(MatDialog);
    const dialogRef = dialog.open(MessageModalComponent, {
      data: options,
      minWidth: '400px'
    });
    return dialogRef.afterClosed();
  }

  //#endregion

}
