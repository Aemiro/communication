import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatResponse } from './chat.response';
import {
  ArchiveChatCommand,
  CreateChatCommand,
  UpdateChatCommand,
} from './chat.command';
import { CurrentUserDto } from '@libs/common';
import { ChatRepository } from '../../persistence/chats/chat.repository';
@Injectable()
export class ChatCommand {
  constructor(private readonly chatRepository: ChatRepository) {}
  async createChat(
    command: CreateChatCommand,
  ): Promise<ChatResponse> {
    const chatDomain = CreateChatCommand.toEntity(command);
    chatDomain.createdBy = command.currentUser.id;
    chatDomain.updatedBy = command.currentUser.id;
    const chat = await this.chatRepository.insert(chatDomain);

    return ChatResponse.toResponse(chat);
  }
  async updateChat(
    command: UpdateChatCommand,
  ): Promise<ChatResponse> {
    const chat = await this.chatRepository.getById(command.id);
    if (!chat) {
      throw new NotFoundException(
        `Chat not found with id ${command.id}`,
      );
    }
    chat.name = command.name;
    chat.description = command.description;
    chat.updatedBy = command?.currentUser?.id;
    const result = await this.chatRepository.save(chat);
    return ChatResponse.toResponse(result);
  }
  async archiveChat(
    command: ArchiveChatCommand,
  ): Promise<ChatResponse> {
    const chatDomain = await this.chatRepository.getById(command.id);
    if (!chatDomain) {
      throw new NotFoundException(
        `Chat not found with id ${command.id}`,
      );
    }
    chatDomain.deletedAt = new Date();
    chatDomain.deletedBy = command.currentUser.id;
    const result = await this.chatRepository.save(chatDomain);

    return ChatResponse.toResponse(result);
  }
  async restoreChat(
    id: string,
    currentUser: CurrentUserDto,
  ): Promise<ChatResponse> {
    const chatDomain = await this.chatRepository.getById(id, [], true);
    if (!chatDomain) {
      throw new NotFoundException(`Chat not found with id ${id}`);
    }
    await this.chatRepository.restore(id);
    chatDomain.deletedAt = null;
    return ChatResponse.toResponse(chatDomain);
  }
  async deleteChat(
    id: string,
    currentUser: CurrentUserDto,
  ): Promise<boolean> {
    const chatDomain = await this.chatRepository.getById(id, [], true);
    if (!chatDomain) {
      throw new NotFoundException(`Chat not found with id ${id}`);
    }
    const result = await this.chatRepository.delete(id);
    return result;
  }
}
