import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MinioService } from '@libs/common';
import { ChatController } from './controllers/chat.controller';
import { ChatEntity } from './persistence/chats/chat.entity';
import { ChatRepository } from './persistence/chats/chat.repository';
import { ChatCommand } from './usecases/chats/chat.usecase.command';
import { ChatQuery } from './usecases/chats/group.usecase.query';
import { MessageEntity } from './persistence/chats/message.entity';
import { ChatMemberEntity } from './persistence/chats/chat-member.entity';

@Module({
  controllers: [
    ChatController,
  ],
  imports: [
    TypeOrmModule.forFeature([
      MessageEntity,
      ChatEntity,
      ChatMemberEntity,
    ]),
  ],
  providers: [
    ChatRepository,
    ChatCommand,
    ChatQuery,
    MinioService,
  ],
})
export class MessagingModule {}
