import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity, FileDto } from '@libs/common';
import { ChatMemberEntity } from './chat-member.entity';
import { MessageEntity } from './message.entity';

@Entity('chats')
export class ChatEntity extends CommonEntity {
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true, type: 'text' })
  description: string;
  @Column({ nullable: true, type: 'jsonb' })
  logo: FileDto;
  @Column({ nullable: true, type: 'jsonb', name: 'cover_image' })
  coverImage: FileDto;
  @Column({ default: false })
  isGroup: boolean;
  @Column({ name: 'last_message_id', nullable: true })
  lastMessageId: string;
  @OneToMany(() => ChatMemberEntity, (member) => member.chat, { cascade: true })
  members: ChatMemberEntity[];

  @OneToMany(() => MessageEntity, (message) => message.chat, { cascade: true })
  messages: MessageEntity[];
  @OneToOne(() => MessageEntity)
  @JoinColumn({ name: 'last_message_id' })
  lastMessage: MessageEntity;
}
