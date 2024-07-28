import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Model } from 'mongoose';
import { Message } from './Schema/message.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { sender: string; store: string; content: string },
  ): Promise<void> {
    const newMessage = new this.messageModel(payload);
    await newMessage.save();
    this.server.to(payload.store).emit('message', newMessage);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    const storeId = client.handshake.query.storeId;
    client.join(storeId);
    this.logger.log(`Client connected: ${client.id} to store ${storeId}`);
  }
}
