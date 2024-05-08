import { Column, Entity, Generated } from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'todos' })
export class Todo extends Base {
  @Column()
  description: string;

  @Column({ name: 'is_complete', default: false })
  isComplete: boolean;

  @Column({ type: 'timestamp' })
  timestamp: string;

  @Column({ name: 'completed_date', type: 'timestamp', nullable: true })
  completedDate: Date;

  @Generated('increment')
  @Column({ name: 'order_key' })
  orderKey: number;
}
