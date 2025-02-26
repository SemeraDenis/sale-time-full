import {
  Entity,
  Column
} from 'typeorm';
import { PersistentEntity } from './base/persistent-entity';

@Entity('Users')
export class User extends PersistentEntity {
  @Column()
  fullName: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column()
  email: string;
}
