import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Movie } from 'src/movie/model/movie.model';
import { User } from 'src/user/model/user.model';

@Table
export class Comments extends Model<Comments> {
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
  content: string;

  @ForeignKey(() => Movie)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  movieId: string;

  @BelongsTo(() => Movie, {
    foreignKey: 'movieId',
    as: 'movie',
  })
  movie: Movie;

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
}
