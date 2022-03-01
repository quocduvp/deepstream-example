import { DeepstreamClient } from '@deepstream/client';
import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({
  // Reconnect after 10, 20 and 30 seconds
  reconnectIntervalIncrement: 10000,
  // Try reconnecting every thirty seconds
  maxReconnectInterval: 30000,
  // We never want to stop trying to reconnect
  maxReconnectAttempts: Infinity,
  // Send heartbeats only once a minute
  heartbeatInterval: 60000,
})
export class EventsGateway {
  @WebSocketServer()
  server: DeepstreamClient;

  @UseGuards()
  @SubscribeMessage('message')
  findAll(@MessageBody() data: any) {
    this.server.emit('message', {
      message: "pong"
    });
  }
}
