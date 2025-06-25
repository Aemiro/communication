import { CurrentUserDto, CurrentUser } from '@libs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateChatCommand,
  UpdateChatCommand,
  ArchiveChatCommand,
} from '../usecases/chats/chat.command';
import { ChatResponse } from '../usecases/chats/chat.response';
import { ChatCommand } from '../usecases/chats/chat.usecase.command';
import {
  ApiPaginatedResponse,
  DataResponseFormat,
} from '@libs/response-format';
import { CollectionQuery, IncludeQuery } from '@libs/collection-query';
import { ChatQuery } from '@messaging/usecases/chats/group.usecase.query';

@Controller('chats')
@ApiTags('chats')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class ChatController {
  constructor(
    private command: ChatCommand,
    private chatQuery: ChatQuery,
  ) {}
  @Get('get-chat/:id')
  @ApiOkResponse({ type: ChatResponse })
  async getChat(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.chatQuery.getChat(
      id,
      includeQuery.includes,
      true,
    );
  }
  @Get('get-archived-chat/:id')
  @ApiOkResponse({ type: ChatResponse })
  async getArchivedChat(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.chatQuery.getChat(
      id,
      includeQuery.includes,
      true,
    );
  }
  @Get('get-chats')
  @ApiPaginatedResponse(ChatResponse)
  async getChats(
    @Query() query: CollectionQuery,
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    return this.chatQuery.getChats(query, currentUser);
  }
  @Post('create-chat')
  @ApiOkResponse({ type: ChatResponse })
  async createChat(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() createChatCommand: CreateChatCommand,
  ) {
    createChatCommand.currentUser = currentUser;
    return this.command.createChat(createChatCommand);
  }
  @Put('update-chat')
  @ApiOkResponse({ type: ChatResponse })
  async updateChat(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() updateChatCommand: UpdateChatCommand,
  ) {
    updateChatCommand.currentUser = currentUser;
    return this.command.updateChat(updateChatCommand);
  }
  @Delete('archive-chat')
  @ApiOkResponse({ type: ChatResponse })
  async archiveChat(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() archiveCommand: ArchiveChatCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveChat(archiveCommand);
  }
  @Delete('delete-chat/:id')
  @ApiOkResponse({ type: Boolean })
  async deleteChat(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('id') id: string,
  ) {
    return this.command.deleteChat(id, currentUser);
  }
  @Post('restore-chat/:id')
  @ApiOkResponse({ type: ChatResponse })
  async restoreChat(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('id') id: string,
  ) {
    return this.command.restoreChat(id, currentUser);
  }
  @Get('get-archived-chats')
  @ApiPaginatedResponse(ChatResponse)
  async getArchivedChats(
    @Query() query: CollectionQuery,
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    return this.chatQuery.getArchivedChats(query, currentUser);
  }
}
