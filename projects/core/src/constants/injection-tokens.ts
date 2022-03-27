import {InjectionToken} from '@angular/core';
import {IMessageBusService} from '../services/interfaces/message-bus-service.interface';
import {IRpcService} from '../services';

// Service provider for message bus.
export const MESSAGE_BUS_SERVICE = new InjectionToken<IMessageBusService>('MESSAGE_BUS_SERVICE');

// Service provider for RPC
export const RPC_SERVICE = new InjectionToken<IRpcService>('RPC_SERVICE');
