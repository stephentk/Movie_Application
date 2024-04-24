import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Favorite } from 'src/favorite/model/favorite.model';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  dateOfBirth: string;

  @Column({
    defaultValue: false,
  })
  FactorAuth: boolean;

  @Column({
    defaultValue: false,
  })
  validFactorAuth: boolean;

  @Column({ type: DataType.STRING })
  FactorAuthCode: string;

  @Column({ type: DataType.STRING })
  registrationToken: string;

  @Column({ type: DataType.STRING })
  profilePictureURL: string;

  @HasMany(() => Favorite)
  favorite: Favorite[];
}
