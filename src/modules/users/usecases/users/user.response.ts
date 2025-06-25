import { FileDto, Address } from '@libs/common';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../persistence/users/user.entity';
import { UserRoleResponse } from './user-role.response';
import { UserContactResponse } from './user-contact.response';
import { DepartmentResponse } from '../departments/department.response';

export class UserResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  middleName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  jobTitle: string;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  profilePicture: FileDto;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  dateOfBirth: Date;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  departmentId: string;
  @ApiProperty()
  endDate: Date;
  @ApiProperty()
  tin: string;
  @ApiProperty()
  employeeNumber: string;
  @ApiProperty()
  address: Address;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;
  @ApiProperty()
  deletedBy: string;
  userRoles?: UserRoleResponse[];
  userContacts?: UserContactResponse[];
  department?: DepartmentResponse;

  static toResponse(entity: UserEntity): UserResponse {
    const response = new UserResponse();
    response.id = entity.id;
    response.firstName = entity.firstName;
    response.middleName = entity.middleName;
    response.lastName = entity.lastName;
    response.email = entity.email;
    response.phone = entity.phone;
    response.departmentId = entity.departmentId;
    response.jobTitle = entity.jobTitle;
    response.gender = entity.gender;
    response.profilePicture = entity.profilePicture;
    response.isActive = entity.isActive;
    response.dateOfBirth = entity.dateOfBirth;
    response.startDate = entity.startDate;
    response.endDate = entity.endDate;
    response.tin = entity.tin;
    response.employeeNumber = entity.employeeNumber;
    response.address = entity.address;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.userRoles) {
      response.userRoles = entity.userRoles.map((userRole) =>
        UserRoleResponse.toResponse(userRole),
      );
    }
    if (entity.userContacts) {
      response.userContacts = entity.userContacts.map((userContact) =>
        UserContactResponse.toResponse(userContact),
      );
    }
    if (entity.department) {
      response.department = DepartmentResponse.toResponse(entity.department);
    }
    return response;
  }
}
