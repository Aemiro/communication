import {
  Entity,
  ManyToOne,
  Column,
  Index,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ChatEntity } from './chat.entity';
import { CommonEntity } from '@libs/common';
import { UserEntity } from '@users/persistence/users/user.entity';

@Entity('chat_members')
// @Index(['chat_id', 'user_id'], { unique: true }) // A user can only be member once per chat
export class ChatMemberEntity extends CommonEntity {
  @Column({ name: 'chat_id' })
    @Index()
  chatId: string;
  @Column({ name: 'user_id' })
  userId: string;
  @Column({ default: false, name: 'is_admin' })
  isAdmin: boolean;
  @ManyToOne(() => ChatEntity, (chat) => chat.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat: ChatEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
