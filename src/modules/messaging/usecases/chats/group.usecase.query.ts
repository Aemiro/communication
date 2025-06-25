import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatResponse } from './chat.response';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '@libs/collection-query';
import { DataResponseFormat } from '@libs/response-format';

import { CurrentUserDto } from '@libs/common';
import { ChatEntity } from '@messaging/persistence/chats/chat.entity';
@Injectable()
export class ChatQuery {
  constructor(
    @InjectRepository(ChatEntity)
    private ChatRepository: Repository<ChatEntity>,
  ) {}
  async getChat(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<ChatResponse> {
    const chat = await this.ChatRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!chat) {
      throw new NotFoundException(`Chat not found with id ${id}`);
    }
    return ChatResponse.toResponse(chat);
  }
  async getChats(
    query: CollectionQuery,
    currentUser: CurrentUserDto,
  ): Promise<DataResponseFormat<ChatResponse>> {
    const dataQuery = QueryConstructor.constructQuery<ChatEntity>(
      this.ChatRepository,
      query,
    );
    const d = new DataResponseFormat<ChatResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => ChatResponse.toResponse(entity));
      d.count = total;
    }
    return d;
  }
  async getArchivedChats(
    query: CollectionQuery,
    currentUser: CurrentUserDto,
  ): Promise<DataResponseFormat<ChatResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<ChatEntity>(
      this.ChatRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<ChatResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => ChatResponse.toResponse(entity));
      d.count = total;
    }
    return d;
  }
}
