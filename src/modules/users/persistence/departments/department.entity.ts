import { Column, Entity, OneToMany } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { CommonEntity } from '@libs/common';
@Entity('departments')
export class DepartmentEntity extends CommonEntity {
  @Column({ name: 'name' })
  name: string;
  @Column({ name: 'description', nullable: true, type: 'text' })
  description: string;
  @OneToMany(() => UserEntity, (user) => user.department, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  users: UserEntity[];
}
