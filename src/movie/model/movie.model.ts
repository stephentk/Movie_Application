import {
  Table,
  Column,
  Model,
  DataType,
  Sequelize,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Comments } from 'src/comment/model/comment.model';
import { User } from 'src/user/model/user.model';
@Table
export class Movie extends Model<Movie> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(255),
  })
  title: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM(
      'Action',
      'Comedy',
      'Drama',
      'Horror',
      'Sci-Fi',
      'Thriller',
    ),
  })
  category: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM('G', 'PG', 'PG-13', 'R', 'NC-17'),
  })
  rating: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  duration: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
    as: 'user',
  })
  user: User;

  @HasMany(() => Comments)
  comments: Comments[];
}
