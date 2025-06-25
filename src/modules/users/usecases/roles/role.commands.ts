import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { RoleEntity } from '../../persistence/roles/role.entity';
import { CurrentUserDto } from '@libs/common';

export class CreateRoleCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  key: string;
  @ApiProperty()
  description: string;
  currentUser: CurrentUserDto;

  static toEntity(command: CreateRoleCommand): RoleEntity {
    const entity = new RoleEntity();
    entity.name = command.name;
    entity.key = command.key;
    entity.description = command.description;
    return entity;
  }
}
export class UpdateRoleCommand extends PartialType(CreateRoleCommand) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchiveRoleCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: CurrentUserDto;
}
