import {
  Entity,
  Column
} from 'typeorm';
import { PersistentEntity } from './base/persistent-entity';

@Entity('Categories')
export class PostCategory extends PersistentEntity {
  @Column()
  title: string;
}