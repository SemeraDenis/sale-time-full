import { Column, Entity } from 'typeorm';
import { PersistentEntity } from './base/persistent-entity';
import {PostStatus} from "../common/enums/post-status.enum";



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

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.ACTIVE })
  status: PostStatus;

  @Column()
  categoryId: number;
}