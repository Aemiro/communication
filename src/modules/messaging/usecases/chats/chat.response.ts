import { FileDto } from '@libs/common';
import { ChatEntity } from '@messaging/persistence/chats/chat.entity';
import { ApiProperty } from '@nestjs/swagger';
export class ChatResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  logo: FileDto;
  @ApiProperty()
  coverImage: FileDto;
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
  static toResponse(entity: ChatEntity): ChatResponse {
    const response = new ChatResponse();
    response.id = entity.id;
    response.name = entity.name;
    response.description = entity.description;
    response.logo = entity.logo;
    response.coverImage = entity.coverImage;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;

    return response;
  }
}
