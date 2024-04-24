import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
  Sequelize,
} from 'sequelize-typescript';
import { Movie } from 'src/movie/model/movie.model';
import { User } from 'src/user/model/user.model';

@Table
export class Favorite extends Model<Favorite> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: number;

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

  @Column({
    allowNull: false,
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  isFavorite: boolean;
}
