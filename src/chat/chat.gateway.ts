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
import { Message, MessageDocument } from './schema/message.schema';
import { Model } from 'mongoose';
import { StoresService } from 'src/store/store.service';

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
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly storesService: StoresService,
  ) {}

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: {
      sender: string;
      store: string;
      recipient: string;
      content: string;
    },
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

  async handleConnection(client: Socket, ...args: any[]) {
    const { storeId, userId, storeName } = client.handshake.query;

    if (storeId && userId && storeName) {
      const store = await this.storesService.findOne(storeId as string);
      if (store && store.name === storeName) {
        client.join(storeId as string);
        this.logger.log(`Client ${userId} joined store room: ${storeId}`);
      } else {
        this.logger.warn(`Invalid store details provided by client: ${userId}`);
        client.disconnect();
      }
    } else {
      this.logger.warn(`Client ${client.id} did not provide required details`);
      client.disconnect();
    }
  }
}
