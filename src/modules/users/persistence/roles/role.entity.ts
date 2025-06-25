import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserRoleEntity } from '../users/user-role.entity';
import { CommonEntity } from '@libs/common';
@Entity('roles')
export class RoleEntity extends CommonEntity {
  @Column({ name: 'name' })
  name: string;
  @Column()
  key: string;
  @Column({ name: 'description', nullable: true, type: 'text' })
  description: string;
  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userRoles: UserRoleEntity[];
}
