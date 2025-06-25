import { ApiProperty } from '@nestjs/swagger';
import { Address, UserContactType } from '@libs/common';
import { UserContactEntity } from '../../persistence/users/user-contact.entity';

export class UserContactResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  middleName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty()
  email?: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  address: Address;
  @ApiProperty()
  contactType: UserContactType;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt?: Date;
  @ApiProperty()
  deletedBy?: string;
  static toResponse(entity: UserContactEntity): UserContactResponse {
    const response = new UserContactResponse();
    response.id = entity.id;
    response.userId = entity.userId;
    response.firstName = entity.firstName;
    response.middleName = entity.middleName;
    response.lastName = entity.lastName;
    response.email = entity.email;
    response.phone = entity.phone;
    response.address = entity.address;
    response.contactType = entity.contactType;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    return response;
  }
}
