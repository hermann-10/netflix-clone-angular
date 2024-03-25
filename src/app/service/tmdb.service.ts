import { Injectable, inject, signal, WritableSignal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApiGenreResponse, MovieApiResponse } from './model/movie.model';
import { State } from './model/state.model';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  http: HttpClient = inject(HttpClient);

  baseURL: string = 'http://api.themoviedb.org';

  private fetchTrendMovie$: WritableSignal<State<MovieApiResponse, HttpErrorResponse>>
  = signal(State.Builder<MovieApiResponse, HttpErrorResponse>().forInit().build());

  fetchTrendMovie = computed(() => this.fetchTrendMovie$());

  //https://api.themoviedb.org/3/trending/movie/day?api_key=798865d2515c75e1f2966a2ca026c110

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

  getHeaders(): HttpHeaders {
    console.log(`Bearer ${environment.TMDB_API_KEY}`);
    return new HttpHeaders().set('Authorization', `Bearer ${environment.TMDB_API_KEY}`);
  }


  getImageUrl(id: string, size: 'original' | 'w-500' | 'w-200'): string{
    return `https://image.tmdb.org/t/p/${size}/${id}`;
  }

  getGenres() {
    return this.http
      .get<ApiGenreResponse>(
        'https://api.themoviedb.org/3/genre/movie/list?api_key=798865d2515c75e1f2966a2ca026c110&language=fr-FR'
      )
      .pipe(map((apiResponse) => apiResponse.genres));
  }


  constructor() { }
}
