import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '../../persistence/roles/role.entity';

export class RoleResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  key: string;
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
  static toResponse(entity: RoleEntity): RoleResponse {
    const response = new RoleResponse();
    response.id = entity.id;
    response.name = entity.name;
    response.description = entity.description;
    response.key = entity.key;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    return response;
  }
}
