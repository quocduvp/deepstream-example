import {
  AbstractWsAdapter,
  MessageMappingProperties,
} from '@nestjs/websockets';
import {
  EMPTY,
  filter,
  first,
  fromEvent,
  map,
  mergeMap,
  Observable,
  share,
  takeUntil,
} from 'rxjs';
import { DeepstreamClient } from '@deepstream/client';
import { isFunction } from 'util';
class CustomDeepstreamClient extends DeepstreamClient {
  constructor(url: string, options?: Partial<any>) {
    super(url, options);
  }
  user: any;

  getUser = () => this.user;
}
export class DsAdapter extends AbstractWsAdapter {
  create(port: number, options?: any) {
    const client = this.createIOServer(port, options);
    return client;
  }

  createIOServer(port, options) {
    return new CustomDeepstreamClient(process.env.DEEPSTREAM_URL, options);
  }

  bindClientConnect(server: CustomDeepstreamClient, callback: Function) {
    server.login(
      {
        username: 'Nguyen',
        type: 'admin',
      },
      (success, data) => {
        if (success) {
          server.user = data.user;
          return callback(server);
        }
      },
    );
  }

  bindClientDisconnect(server: CustomDeepstreamClient, callback) {
    // server.on('connectionStateChanged', callback);
  }

  public bindMessageHandlers(
    socket: CustomDeepstreamClient,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>,
  ) {
    handlers.forEach(({ message, callback }) => {
      // console.log( message, callback)
      socket.event.subscribe(message, (data) => {
        transform(callback(data)).subscribe();
      })
    });
  }

  bindMessageHandler(
    buffer,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ): Observable<any> {
    console.log(buffer, handlers, process);
    const message = JSON.parse(buffer.data);
    const messageHandler = handlers.find(
      (handler) => handler.message === message.event,
    );
    if (!messageHandler) {
      return EMPTY;
    }
    return process(messageHandler.callback(message.data));
  }

  public mapPayload(payload: unknown): { data: any; ack?: Function } {
    if (!Array.isArray(payload)) {
      if (isFunction(payload)) {
        return { data: undefined, ack: payload as Function };
      }
      return { data: payload };
    }
    const lastElement = payload[payload.length - 1];
    const isAck = isFunction(lastElement);
    if (isAck) {
      const size = payload.length - 1;
      return {
        data: size === 1 ? payload[0] : payload.slice(0, size),
        ack: lastElement,
      };
    }
    return { data: payload };
  }
}
