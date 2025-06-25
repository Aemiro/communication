import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { IBaseRepository } from '../interfaces/base.repository.interface';
import { CommonEntity } from '../common.entity';

export abstract class BaseRepository<T extends CommonEntity>
  implements IBaseRepository<T>
{
  constructor(private readonly repository: Repository<T>) {}

  async getAll(relations: string[] = [], withDeleted = false): Promise<T[]> {
    const option = {};
    return this.repository.find({ where: option, withDeleted, relations });
  }

  async getById(
    id: string,
    relations: string[] = [],
    withDeleted = false,
  ): Promise<T | null> {
    const findOptions: FindOneOptions<T> = {
      where: { id } as FindOptionsWhere<T>,
      relations,
      withDeleted,
    };

    return (await this.repository.findOne(findOptions)) || null;
  }
  async insert(data: T): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async update(id: string, data: Partial<any>): Promise<T | null> {
    await this.repository.update(id, data);
    return await this.getById(id);
  }
  async save(itemData: DeepPartial<T>): Promise<T> {
    return await this.repository.save(itemData);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
  }
  async restore(id: string): Promise<boolean> {
    const result = await this.repository.restore(id);
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
  }
  async archive(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
  }
  async getOneByJsonField(
    field: string,
    jsonProperty: string,
    value: any,
    relations = [],
    withDeleted = false,
  ): Promise<T | null> {
    const builder = this.repository
      .createQueryBuilder('table')
      .where(`table.${field}->>'${jsonProperty}' = :property`, {
        property: value,
      });
    if (relations.length > 0) {
      relations.forEach((relation) => {
        builder.leftJoinAndSelect(`table.${relation}`, relation);
      });
    }
    if (withDeleted) {
      builder.withDeleted();
    }
    return builder.getOne();
  }
  async getOneBy(
    field: string,
    value: any,
    relations: string[] = [],
    withDeleted = false,
  ): Promise<T | null> {
    const option: { [key: string]: any } = {};
    option[field] = value;

    return await this.repository.findOne({
      where: option as FindOptionsWhere<T>,
      relations,
      withDeleted,
    });
  }
  async getAllBy(
    field: string,
    value: any,
    relations: string[] = [],
    withDeleted = false,
  ): Promise<T[]> {
    const option: { [key: string]: any } = {};
    option[field] = value;

    return await this.repository.find({
      where: option as FindOptionsWhere<T>,
      relations,
      withDeleted,
    });
  }
}
