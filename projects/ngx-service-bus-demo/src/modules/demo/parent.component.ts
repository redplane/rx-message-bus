import { Input, Directive } from "@angular/core";

@Directive()
export class ParentComponent {

  //#region Properties

  private _name: string;

  //#endregion

  //#region Accessors

  public get name(): string {
    return this._name;
  }

  @Input('name')
  public set name(value: string) {
    this._name = value;
  }

  //#endregion
}
