import {InjectionToken} from '@angular/core';
import {INgRxMessageBusService} from '../services/interfaces/ngrx-message-bus-service.interface';
import {IRpcService} from '../services';

// Service provider for message bus.
export const MESSAGE_BUS_SERVICE_PROVIDER = new InjectionToken<INgRxMessageBusService>('MESSAGE_BUS_SERVICE_PROVIDER');

// Service provider for RPC
export const RPC_SERVICE_PROVIDER = new InjectionToken<IRpcService>('RPC_SERVICE_PROVIDER');
