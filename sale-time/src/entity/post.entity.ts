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

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ type: 'enum', enum: PostState, default: PostState.ACTIVE })
  status: PostState;

  @ManyToOne(() => PostCategory, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: PostCategory;
}