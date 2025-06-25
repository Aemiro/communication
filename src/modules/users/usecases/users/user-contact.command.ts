import { Address, UserContactType, CurrentUserDto } from '@libs/common';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { UserContactEntity } from '../../persistence/users/user-contact.entity';

export class CreateUserContactCommand {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  middleName: string;

  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  address: Address;

  @ApiProperty({ enum: UserContactType })
  @IsNotEmpty()
  contactType: UserContactType;

  currentUser?: CurrentUserDto;

  static toEntity(command: CreateUserContactCommand): UserContactEntity {
    const entity = new UserContactEntity();
    entity.userId = command.userId;
    entity.firstName = command.firstName;
    entity.middleName = command.middleName;
    entity.lastName = command.lastName;
    entity.email = command.email;
    entity.phone = command.phone;
    entity.address = command.address;
    entity.contactType = command.contactType;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}

export class UpdateUserContactCommand extends PartialType(
  CreateUserContactCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}

export class RemoveUserContactCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  currentUser: CurrentUserDto;
}
