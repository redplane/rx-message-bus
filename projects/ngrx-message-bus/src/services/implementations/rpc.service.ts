import {IRpcService} from '../interfaces/rpc-service.interface';
import {Observable, ReplaySubject} from 'rxjs';
import {TimeUpdateMessageEvent} from '../../../../ngx-service-bus-demo/src/models/time-update.message-event';
import {take} from 'rxjs/operators';
import {GetTimeCommandResponse} from '../../../../ngx-service-bus-demo/src/models/get-time-command-response';
import * as moment from 'moment';
import {TimeQueryMessageEvent} from '../../../../ngx-service-bus-demo/src/models/time-query.message-event';
import {GetTimeCommandRequest} from '../../../../ngx-service-bus-demo/src/models/get-time-command-request';
import {NgRxMessageBusService} from './ngrx-message-bus.service';

export class RpcService extends NgRxMessageBusService implements IRpcService {

  //#region Methods

  public requestAsync<TRequest, TResponse>(namespace: string, method: string, data: TRequest): Observable<TResponse> {
    const resolver = new ReplaySubject<TResponse>(1);
    this.hookMessageChannel<TResponse>(namespace, method)
      .pipe(
        take(1)
      )
      .subscribe((value: TResponse) => {
        resolver.next(value);
      });

    this.addTypedMessage(new TimeQueryMessageEvent(), new GetTimeCommandRequest());
    return resolver.pipe(take(1));
  }

  //#endregion
}
