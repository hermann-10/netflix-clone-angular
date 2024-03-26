import { Injectable, inject, signal, WritableSignal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { MovieApiResponse } from './model/movie.model';
import { State } from './model/state.model';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs';
import { GenresResponse } from './model/genre.model';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  http: HttpClient = inject(HttpClient);

  baseURL: string = 'http://api.themoviedb.org';

  private fetchTrendMovie$: WritableSignal<State<MovieApiResponse, HttpErrorResponse>>
  = signal(State.Builder<MovieApiResponse, HttpErrorResponse>().forInit().build());

  fetchTrendMovie = computed(() => this.fetchTrendMovie$());

  private genres$: WritableSignal<State<GenresResponse, HttpErrorResponse>>
  = signal(State.Builder<GenresResponse, HttpErrorResponse>().forInit().build());
  genres = computed(() => this.genres$());

  private moviesByGenre$: WritableSignal<State<MovieApiResponse, HttpErrorResponse>>
  = signal(State.Builder<MovieApiResponse, HttpErrorResponse>().forInit().build());

  moviesByGenre = computed(() => this.moviesByGenre$());

   getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${environment.TMDB_API_KEY}`);
  }

   getTrends(): void {
     this.http.get<MovieApiResponse>(
       `${this.baseURL}/3/trending/movie/day`, {headers: this.getHeaders()})
       .subscribe({
         next: tmdbResponse =>
           this.fetchTrendMovie$
             .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
               .forSuccess(tmdbResponse).build()),
         error: err => {
           this.fetchTrendMovie$
             .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
               .forError(err).build())
         }
       });
   }


   getAllGenres(): void {
    this.http.get<GenresResponse>(
      `${this.baseURL}/3/genre/movie/list`, {headers: this.getHeaders()})
      .subscribe({
        next: genresResponse =>
          this.genres$
            .set(State.Builder<GenresResponse, HttpErrorResponse>()
              .forSuccess(genresResponse).build()),
        error: err => {
          this.genres$
            .set(State.Builder<GenresResponse, HttpErrorResponse>()
              .forError(err).build())
        }
      });
  }

  getImageURL(id: string, size: 'original' | 'w500' | 'w200'): string{
    return `https://image.tmdb.org/t/p/${size}/${id}`;
  }

  getMoviesByGenre(genreId: number): void{
    let queryParam: HttpParams = new HttpParams();
    queryParam = queryParam.set("language", "en-US");
    queryParam = queryParam.set("with_genres", genreId);
    this.http.get<MovieApiResponse>(
      `${this.baseURL}/3/discover/movie`, {headers: this.getHeaders(), params: queryParam})
      .subscribe({
        next: moviesByGenreResponse => {
          moviesByGenreResponse.genreId = genreId;
          this.moviesByGenre$
            .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
              .forSuccess(moviesByGenreResponse).build())
      },
        error: err => {
          this.moviesByGenre$
            .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
              .forError(err).build())
        }
      });
  }


  constructor() { }
}
