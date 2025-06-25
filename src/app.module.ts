import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SettingModule } from '@settings/setting.module';
import { SocketModule } from '@sockets/socket.module';
import { UserModule } from '@users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentEntity } from '@users/persistence/departments/department.entity';
import { RoleEntity } from '@users/persistence/roles/role.entity';
import { UserRoleEntity } from '@users/persistence/users/user-role.entity';
import { UserEntity } from '@users/persistence/users/user.entity';
import { UserContactEntity } from '@users/persistence/users/user-contact.entity';
import { ChatMemberEntity } from '@messaging/persistence/chats/chat-member.entity';
import { ChatEntity } from '@messaging/persistence/chats/chat.entity';
import { MessageEntity } from '@messaging/persistence/chats/message.entity';
import { MessagingModule } from '@messaging/messaging.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      // url: process.env.DB_URL,
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      schema: process.env.DATABASE_SCHEMA,
      port: parseInt(process.env.DATABASE_PORT),
      entities: [
        UserEntity,
        RoleEntity,
        DepartmentEntity,
        UserRoleEntity,
        UserContactEntity,
        ChatEntity,
        MessageEntity,
        ChatMemberEntity,
      ],
      // synchronize: true,
      // synchronize: process.env.NODE_ENV === 'production' ? false : true,
      logging: process.env.NODE_ENV === 'production' ? false : true,
      autoLoadEntities: true,
    }),
    UserModule,
    SettingModule,
    SocketModule,
    MessagingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
