import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CurrentUserDto } from '@libs/common';
import { ChatEntity } from '@messaging/persistence/chats/chat.entity';
export class CreateChatCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  description: string;
  currentUser: CurrentUserDto;

  static toEntity(command: CreateChatCommand): ChatEntity {
    const entity = new ChatEntity();
    entity.name = command.name;
    entity.description = command.description;
    entity.updatedBy = command?.currentUser?.id;
    entity.createdBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateChatCommand extends PartialType(
  CreateChatCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchiveChatCommand {
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
