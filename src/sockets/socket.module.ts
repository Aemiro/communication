import { SocketGateway } from './socket.gateway';
import { Module } from '@nestjs/common';
@Module({
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
