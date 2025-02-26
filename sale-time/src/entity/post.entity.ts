import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PersistentEntity } from './base/persistent-entity';
import { PostCategory } from './product-category.entity';
import { User } from './user.entity';

export enum PostState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

@Entity('Posts')
export class Post extends PersistentEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  ownerId: number;

  @Column({ type: 'enum', enum: PostState, default: PostState.ACTIVE })
  status: PostState;

  @Column()
  categoryId: number;
}