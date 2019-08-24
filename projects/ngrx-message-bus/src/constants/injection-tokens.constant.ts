import {InjectionToken} from "@angular/core";
import {INgRxMessageBusService} from "../services/interfaces/ngrx-message-bus-service.interface";

// Message bus service injection token.
export const MESSAGE_BUS_SERVICE_INJECTOR = new InjectionToken<INgRxMessageBusService>('MESSAGE_BUS_SERVICE_INJECTOR');
