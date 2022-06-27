import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ModalOptions} from './modal-options';

@Component({
  selector: 'message-modal',
  templateUrl: 'message-modal.component.html',
  styleUrls: ['message-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageModalComponent implements OnInit {

  //#region Properties

  private readonly __message: string;

  private readonly __title: string;

  //#endregion

  //#region Accessors

  public get message(): string {
    return this.__message;
  }

  public get title(): string {
    return this.__title;
  }

  //#endregion

  //#region Constructor

  public constructor(@Inject(MAT_DIALOG_DATA) options: ModalOptions) {
    this.__message = options.content;
    this.__title = options.title;
  }

  //#endregion

  //#region Methods

  public ngOnInit(): void {
  }

  //#endregion
}
