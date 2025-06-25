import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserRoleEntity } from './user-role.entity';
import { Address, CommonEntity, FileDto } from '@libs/common';
import { UserContactEntity } from './user-contact.entity';
import { DepartmentEntity } from '../departments/department.entity';
@Entity('users')
export class UserEntity extends CommonEntity {
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
  @Column()
  password: string;
  @Column({ name: 'job_title', nullable: true })
  jobTitle: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ name: 'profile_picture', nullable: true, type: 'jsonb' })
  profilePicture: FileDto;
  @Column({ name: 'is_active', nullable: true, default: true })
  isActive: boolean;
  @Column({ name: 'date_of_birth', nullable: true, type: 'date' })
  dateOfBirth: Date;
  @Column({ type: 'date', name: 'start_date', nullable: true })
  startDate: Date;
  @Column({ name: 'end_date', nullable: true, type: 'date' })
  endDate: Date;
  @Column({ name: 'tin', nullable: true })
  tin: string;
  @Column({ name: 'employee_number', nullable: true })
  employeeNumber: string;
  @Column({ type: 'jsonb', nullable: true })
  address: Address;
  @Column({ name: 'department_id', nullable: true })
  departmentId: string;
  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userRoles: UserRoleEntity[];
  @ManyToOne(() => DepartmentEntity, (department) => department.users, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;
  @OneToMany(() => UserContactEntity, (userContacts) => userContacts.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userContacts: UserContactEntity[];
  addUserRole(userRole: UserRoleEntity) {
    this.userRoles.push(userRole);
  }
  updateUserRole(userRole: UserRoleEntity) {
    const existIndex = this.userRoles.findIndex(
      (element) => element.id === userRole.id,
    );
    this.userRoles[existIndex] = userRole;
  }
  removeUserRole(id: string) {
    this.userRoles = this.userRoles.filter((element) => element.id !== id);
  }
  updateUserRoles(userRoles: UserRoleEntity[]) {
    this.userRoles = userRoles;
  }

  addUserContact(userContact: UserContactEntity) {
    this.userContacts.push(userContact);
  }
  updateUserContact(userContact: UserContactEntity) {
    const existIndex = this.userContacts.findIndex(
      (element) => element.id === userContact.id,
    );
    this.userContacts[existIndex] = userContact;
  }
  removeUserContact(id: string) {
    this.userContacts = this.userContacts.filter(
      (element) => element.id !== id,
    );
  }
  updateUserContacts(userContacts: UserContactEntity[]) {
    this.userContacts = userContacts;
  }
}
