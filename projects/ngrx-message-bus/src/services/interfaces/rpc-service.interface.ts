import {Observable} from 'rxjs';

export interface IRpcService {
  
  //#region Methods
  
  requestAsync<T>(namespace: string, method: string, data: T): Observable<any>;
  
  //#endregion
  
}
