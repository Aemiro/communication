import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@libs/common';
import { ChatEntity } from './chat.entity';

@Injectable()
export class ChatRepository extends BaseRepository<ChatEntity> {
  constructor(
    @InjectRepository(ChatEntity)
    repository: Repository<ChatEntity>,
  ) {
    super(repository);
  }
}
