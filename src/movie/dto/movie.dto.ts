export class MovieDto {
  title: string;
  category: string;
  rating: string;
  duration: number;
  userId: string;
}

export class UpdateMovieDto {
  id: number;
  title: string;
  category: string;
  rating: string;
  duration: number;
  userId?: string;
}
