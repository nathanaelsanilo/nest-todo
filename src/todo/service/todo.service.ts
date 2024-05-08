import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { TodoCountCompletedDto } from '../dto/todo-count-completed.dto';
import { TodoCreateDto } from '../dto/todo-create.dto';
import { TodoDetailDto } from '../dto/todo-detail.dto';
import { TodoListDto } from '../dto/todo-list.dto';
import { Todo } from '../entity/todo.entity';
import { TodoMapper } from '../mapper/todo.mapper';

const ONE = 1;
const ZERO = 0;

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
  ) {}

  async findAll(name?: string): Promise<TodoListDto[]> {
    const entities = await this.todoRepository.find({
      where: {
        description: name ? Like(`%${name}%`) : undefined,
      },
      order: {
        id: 'desc',
      },
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

    entity.isComplete = !entity.isComplete;
    entity.completedDate = entity.isComplete ? new Date() : null;

    const result = await this.todoRepository.save(entity);

    return TodoMapper.toDetailDto(result);
  }

  async countComplete(): Promise<TodoCountCompletedDto> {
    const dto = new TodoCountCompletedDto();

    const [result, count] = await this.todoRepository.findAndCount();

    dto.completed = result.filter((e) => e.isComplete).length;
    dto.total = count;
    dto.progress = Math.ceil((dto.completed / dto.total) * 100);

    return dto;
  }

  increment(key: number, list: Todo[]) {
    if (key === ZERO) return;

    const before = list[key - ONE];
    const after = list[key];
    list[key] = before;
    list[key - ONE] = after;
  }

  decrement(key: number, list: Todo[]) {
    if (key === list.length) return;

    const before = list[key + ONE];
    const after = list[key];
    list[key] = before;
    list[key + ONE] = after;
  }
}
