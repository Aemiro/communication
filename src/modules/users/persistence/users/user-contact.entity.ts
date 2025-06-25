import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { Address, CommonEntity, UserContactType } from '@libs/common';
@Entity('user_contacts')
export class UserContactEntity extends CommonEntity {
  @Column({ name: 'user_id' })
  userId: string;
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'middle_name' })
  middleName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;
  @Column({ nullable: true })
  email: string;
  @Column()
  phone: string;
  @Column({ name: 'address', type: 'jsonb' })
  address: Address;
  @Column({ name: 'contact_type', type: 'enum', enum: UserContactType, default: UserContactType.EMERGENCY })
  contactType: UserContactType;
  @ManyToOne(() => UserEntity, (user) => user.userContacts, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

}
