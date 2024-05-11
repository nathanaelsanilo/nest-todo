import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoCreateDto } from '../dto/todo-create.dto';
import { TodoDetailDto } from '../dto/todo-detail.dto';
import { TodoListDto } from '../dto/todo-list.dto';
import { TodoReorderDto } from '../dto/todo-reorder.dto';
import { Todo } from '../entity/todo.entity';
import { TodoService } from './todo.service';

const listTodo: Todo[] = [
  {
    id: 1,
    description: 'lunch',
    isComplete: false,
    timestamp: '',
    completedDate: new Date('2020-12-31 08:59:59'),
    createdDate: new Date('2020-12-31 08:59:59'),
    updatedDate: new Date('2020-12-31 08:59:59'),
    orderKey: 1,
  },
  {
    id: 2,
    description: 'breakfast',
    isComplete: true,
    timestamp: '',
    completedDate: new Date('2020-12-31 08:59:59'),
    createdDate: new Date('2020-12-31 08:59:59'),
    updatedDate: new Date('2020-12-31 08:59:59'),
    orderKey: 2,
  },
];

const mockListTodo: TodoListDto[] = [
  {
    id: 1,
    description: 'lunch',
    is_complete: false,
    timestamp: '',
    order_key: 1,
  },
  {
    id: 2,
    description: 'breakfast',
    is_complete: true,
    timestamp: '',
    order_key: 2,
  },
];

const oneTodo = {
  id: 1,
  description: 'lunch',
  isComplete: false,
  timestamp: 8888,
};

const mockDetailTodoDto = {
  id: 1,
  description: 'lunch',
  is_complete: false,
  timestamp: 8888,
};

describe('TodoService', () => {
  let service: TodoService;
  let repository: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          // https://github.com/nestjs/nest/blob/master/sample/05-sql-typeorm/src/users/users.service.spec.ts#L2
          provide: getRepositoryToken(Todo),

          useValue: {
            save: jest.fn().mockResolvedValue(oneTodo),
            find: jest.fn().mockResolvedValue(listTodo),
            findBy: jest.fn().mockResolvedValue(listTodo),
            findOne: jest.fn().mockResolvedValue(oneTodo),
            findAndCount: jest.fn().mockResolvedValue([listTodo, 2]),
            delete: jest.fn(),
            remove: jest.fn(),
            findOneOrFail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of todo', async () => {
    const data = await service.findAll();
    expect(data).toEqual(mockListTodo);
  });

  it('should create new todo', async () => {
    const mockTodo = new TodoCreateDto();
    mockTodo.description = 'lunch';
    mockTodo.timestamp = '';
    mockTodo.is_complete = false;

    const newTodo: TodoDetailDto = await service.create(mockTodo);

    expect(newTodo).toEqual(mockDetailTodoDto);
  });

  it('should return detail', async () => {
    const data: TodoDetailDto = await service.findOne(1);
    expect(data).toEqual(mockDetailTodoDto);
  });

  it('should delete todo by id', async () => {
    const id = 1;
    const result = await service.delete(id);
    expect(result).toBe(true);
  });

  it('should complete todo', async () => {
    const completedDate = new Date();
    const mockEntity: Todo = {
      isComplete: false,
      id: 1,
      description: '',
      timestamp: '',
      completedDate: null,
      createdDate: new Date('2020-12-31 08:59:59'),
      updatedDate: new Date('2020-12-31 10:59:59'),
      orderKey: 1,
    };

    const dto = new TodoDetailDto();
    dto.description = '';
    dto.id = 1;
    dto.is_complete = true;
    dto.timestamp = '';

    const spyFind = jest.spyOn(repository, 'findOneOrFail');
    const spySave = jest.spyOn(repository, 'save');

    spyFind.mockResolvedValueOnce(mockEntity);
    spySave.mockResolvedValueOnce({
      id: 1,
      isComplete: true,
      description: '',
      timestamp: '',
      completedDate: completedDate,
      createdDate: new Date('2020-12-31 08:59:59'),
      updatedDate: new Date(),
      orderKey: 1,
    });

    const id = 1;
    const result = await service.complete(id);

    expect(spyFind).toHaveBeenCalledTimes(1);
    expect(spyFind).toHaveBeenCalledWith({ where: { id: 1 } });

    expect(spySave).toHaveBeenCalledTimes(1);
    expect(spySave).toHaveBeenCalledWith({
      id: 1,
      description: '',
      isComplete: true,
      timestamp: '',
      completedDate: completedDate,
      createdDate: new Date('2020-12-31 08:59:59'),
      updatedDate: new Date('2020-12-31 10:59:59'),
      orderKey: 1,
    });

    expect(result).toEqual(dto);
  });

  it('should count completed todo', async () => {
    const spyFind = jest.spyOn(repository, 'find');
    spyFind.mockResolvedValueOnce([
      {
        id: 1,
        description: 'lunch',
        isComplete: false,
        timestamp: '',
        completedDate: null,
        createdDate: new Date('2020-12-31 08:59:59'),
        updatedDate: new Date('2020-12-31 10:59:59'),
        orderKey: 1,
      },
      {
        id: 2,
        description: 'breakfast',
        isComplete: true,
        timestamp: '',
        completedDate: new Date('2020-12-31 08:59:59'),
        createdDate: new Date('2020-12-31 08:59:59'),
        updatedDate: new Date('2020-12-31 08:59:59'),
        orderKey: 2,
      },
    ]);

    const result = await service.countComplete();

    expect(result).toEqual({
      total: 2,
      completed: 1,
      progress: 50,
    });
  });

  it('should reorder', async () => {
    const mockAll: Todo[] = [
      {
        id: 1,
        description: 'lunch',
        isComplete: false,
        timestamp: '',
        completedDate: null,
        createdDate: new Date('2020-12-31 08:59:59'),
        updatedDate: new Date('2020-12-31 10:59:59'),
        orderKey: 2,
      },
      {
        id: 2,
        description: 'breakfast',
        isComplete: true,
        timestamp: '',
        completedDate: new Date('2020-12-31 08:59:59'),
        createdDate: new Date('2020-12-31 08:59:59'),
        updatedDate: new Date('2020-12-31 08:59:59'),
        orderKey: 1,
      },
    ];
    jest.spyOn(repository, 'save');
    jest.spyOn(repository, 'find').mockResolvedValueOnce(mockAll);

    const dto = new TodoReorderDto();
    dto.order = 'dec';
    dto.order_key = 2;

    const result = await service.reorder(dto);
    expect(result[1].id).toBe(2);

    dto.order = 'inc';
    dto.order_key = 1;

    const result2 = await service.reorder(dto);
    expect(result2[0].id).toBe(1);
  });
});
