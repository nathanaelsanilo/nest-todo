import { TodoDetailDto } from '../dto/todo-detail.dto';
import { TodoListDto } from '../dto/todo-list.dto';
import { Todo } from '../entity/todo.entity';

export class TodoMapper {
  static toDetailDto(data: Todo): TodoDetailDto {
    const dto = new TodoDetailDto();
    dto.description = data.description;
    dto.id = data.id;
    dto.is_complete = data.isComplete;
    dto.timestamp = data.timestamp;
    return dto;
  }

  static toListDto(data: Todo[]): TodoListDto[] {
    return data.map((e) => {
      const dto = new TodoListDto();
      dto.description = e.description;
      dto.id = e.id;
      dto.is_complete = e.isComplete;
      dto.timestamp = e.timestamp;
      dto.order_key = e.orderKey;
      return dto;
    });
  }
}
