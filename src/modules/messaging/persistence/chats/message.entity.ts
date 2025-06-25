import {
  Entity,
  ManyToOne,
  Column,
  Index,
  JoinColumn,
} from 'typeorm';
import { ChatEntity } from './chat.entity';
import { CommonEntity } from '@libs/common';
import { UserEntity } from '@users/persistence/users/user.entity';

@Entity('messages')
// @Index(['chat_id', 'created_at']) // For fast retrieval of chat messages by time
export class MessageEntity extends CommonEntity {
  @Column({ name: 'chat_id' })
    @Index()
  chatId: string;
  @Column({ name: 'sender_id' })
  senderId: string;
  @Column('text', { nullable: true })
  content: string;
  @Column({ nullable: true })
  repliedToMessageId?: string; // For reply feature
  @Column({ nullable: true })
  forwardedFromUserId?: string; // For forward feature
  @ManyToOne(() => ChatEntity, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat: ChatEntity;

  @ManyToOne(() => UserEntity, { eager: true }) // Eager load sender info
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;
}
