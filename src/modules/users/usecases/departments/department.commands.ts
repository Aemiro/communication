import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DepartmentEntity } from '../../persistence/departments/department.entity';
import { CurrentUserDto } from '@libs/common';

export class CreateDepartmentCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  description: string;
  currentUser: CurrentUserDto;

  static toEntity(command: CreateDepartmentCommand): DepartmentEntity {
    const entity = new DepartmentEntity();
    entity.name = command.name;
    entity.description = command.description;
    return entity;
  }
}
export class UpdateDepartmentCommand extends PartialType(
  CreateDepartmentCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchiveDepartmentCommand {
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
