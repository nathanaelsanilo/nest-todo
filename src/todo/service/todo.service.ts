import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { TodoCreateDto } from '../dto/todo-create.dto';
import { TodoDetailDto } from '../dto/todo-detail.dto';
import { TodoListDto } from '../dto/todo-list.dto';
import { Todo } from '../entity/todo.entity';
import { TodoMapper } from '../mapper/todo.mapper';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
  ) {}

  async findAll(name?: string): Promise<TodoListDto[]> {
    const entities = await this.todoRepository.findBy({
      description: name ? Like(`%${name}%`) : undefined,
    });

    return TodoMapper.toListDto(entities);
  }

  async create(dto: TodoCreateDto): Promise<TodoDetailDto> {
    const todo = new Todo();
    todo.description = dto.description;
    todo.isComplete = dto.is_complete;
    todo.timestamp = dto.timestamp;

    const saved = await this.todoRepository.save(todo);

    return TodoMapper.toDetailDto(saved);
  }

  async findOne(id: number): Promise<TodoDetailDto> {
    const data = await this.todoRepository.findOne({ where: { id } });
    return TodoMapper.toDetailDto(data);
  }

  async delete(id: number): Promise<boolean> {
    const entity = await this.todoRepository.findOneOrFail({
      where: { id },
    });
    await this.todoRepository.remove(entity);

    return true;
  }

  async complete(id: number): Promise<TodoDetailDto> {
    const entity = await this.todoRepository.findOneOrFail({
      where: { id },
    });

    const result = await this.todoRepository.save({
      id,
      isComplete: !entity.isComplete,
    });

    return TodoMapper.toDetailDto(result);
  }
}
