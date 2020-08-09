import {InjectionToken} from '@angular/core';
import {INgRxMessageBusService} from '../services/interfaces/ngrx-message-bus-service.interface';

// Service provider for message bus.
export const MESSAGE_BUS_SERVICE_PROVIDER = new InjectionToken<INgRxMessageBusService>('Service provider for message bus');
