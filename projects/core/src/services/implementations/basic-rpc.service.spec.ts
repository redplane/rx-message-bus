import {discardPeriodicTasks, fakeAsync, flush, flushMicrotasks, tick} from '@angular/core/testing';
import {BasicRpcService, IRpcService, ITypedRpcRequest} from 'ngrx-message-bus';
import {catchError, take} from 'rxjs/operators';
import {of, Subscription, TimeoutError} from 'rxjs';

class RemoteMessage implements ITypedRpcRequest<string, string> {

  //#region Properties

  public readonly method: string;

  public readonly namespace: string;

  //#endregion

  //#region Constructor

  public constructor() {
    this.method = 'Method';
    this.namespace = 'Namespace';
  }

  //#endregion
}

describe('BasicRpcService', () => {

  //#region Properties

  let _subscription: Subscription;

  //#endregion

  //#region Life cycle

  beforeEach(() => {
    _subscription = new Subscription();
  });

  afterEach(() => {
    if (_subscription && !_subscription.closed) {
      _subscription.unsubscribe();
    }
  });

  //#endregion

  //#region Methods

  it('Rpc call is successful when remote message is responded', fakeAsync(() => {

    const basicRpcService: IRpcService = new BasicRpcService();
    const greetingText = 'Hello';
    const repliedText = 'Hello world';

    const hookMethodRequestSubscription = basicRpcService
      .hookMethodRequestAsync<string, string>(new RemoteMessage())
      .pipe(take(1))
      .subscribe(message => basicRpcService.sendResponse(new RemoteMessage(), message.id, repliedText));
    _subscription.add(hookMethodRequestSubscription);

    let actualRepliedText = null;
    const sendRpcRequestSubscription = basicRpcService.sendRequestAsync(new RemoteMessage(), greetingText)
      .subscribe(szText => {
        actualRepliedText = szText;
      });
    _subscription.add(sendRpcRequestSubscription);

    tick(500);
    expect(actualRepliedText).toEqual(repliedText);
  }));

  it('Rpc call is failed when remote message is not responded', fakeAsync(() => {
    const basicRpcService: IRpcService = new BasicRpcService();
    const greetingText = 'Hello';

    let actualRepliedText = null;
    let hasTimeoutError = false;
    const sendRpcRequestSubscription = basicRpcService
      .sendRequestAsync(new RemoteMessage(), greetingText)
      .pipe(
        catchError(error => {
          if (error instanceof TimeoutError) {
            hasTimeoutError = true;
          }

          return of(null);
        })
      )
      .subscribe(szText => {
        actualRepliedText = szText;
      });
    _subscription.add(sendRpcRequestSubscription);

    tick(500);
    expect(actualRepliedText).toBeNull();
    expect(hasTimeoutError).toBeFalse();
  }));

  it('Rpc call is timeout when remote message is not responded', fakeAsync(() => {
    const basicRpcService: IRpcService = new BasicRpcService();
    const greetingText = 'Hello';

    let actualRepliedText = null;
    let hasTimeoutError = false;
    const sendRpcRequestSubscription = basicRpcService
      .sendRequestAsync(new RemoteMessage(), greetingText, 500)
      .pipe(
        catchError(error => {
          if (error instanceof TimeoutError) {
            hasTimeoutError = true;
          }

          return of(null);
        })
      )
      .subscribe(szText => {
        actualRepliedText = szText;
      });
    _subscription.add(sendRpcRequestSubscription);

    tick(900);
    expect(actualRepliedText).toBeNull();
    expect(hasTimeoutError).toBeTrue();
  }));

  //#endregion

});
