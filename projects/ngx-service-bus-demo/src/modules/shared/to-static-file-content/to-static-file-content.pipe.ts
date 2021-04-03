import {Injector, Pipe, PipeTransform} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Pipe({
  name: 'toStaticFileContentAsync'
})
export class ToStaticFileContentPipe implements PipeTransform {

  //#region Properties

  private readonly _httpClient: HttpClient;

  //#endregion

  //#region Constructor

  public constructor(injector: Injector) {
    this._httpClient = injector.get(HttpClient);
  }

  //#endregion


  //#region Methods

  public transform(value: string, ...args: any[]): Observable<string> {
    return this._httpClient
      .get(value, {
        responseType: 'text'
      })
      .pipe(
        map(x => x as unknown as string)
      );
  }

  //#endregion
}
