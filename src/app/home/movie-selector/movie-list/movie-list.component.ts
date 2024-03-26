import { Component, Input, OnInit, effect, inject } from '@angular/core';
import { TmdbService } from '../../../service/tmdb.service';
import { Movie, MovieApiResponse } from '../../../service/model/movie.model';
import { MovieCardComponent } from './movie-card/movie-card.component';

export type Mode = 'GENRE' | 'TREND'
@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit{

  @Input() genreId: number = -1;

  @Input() mode: Mode= 'GENRE';

  tmdbService = inject(TmdbService);

  moviesByGenre : Movie[] | undefined;
  trendsMovies : Movie[] | undefined;

  constructor(){
    effect(() => {
      if(this.mode === 'GENRE'){
        const moviesByGenreResponse = this.tmdbService.moviesByGenre().value ?? {} as MovieApiResponse;
        if(moviesByGenreResponse.genreId === this.genreId){
          this.moviesByGenre = moviesByGenreResponse.results;
        }
      } else if(this.mode === 'TREND'){
        const trendingMoviesResponse = this.tmdbService.fetchTrendMovie().value;
        if(trendingMoviesResponse){
          this.trendsMovies = trendingMoviesResponse.results;
        }
      }
    });
  }

  ngOnInit(): void {
    this.fetchMoviesByGenre();
    console.log('TRENDS: ', this.fetchTrends());
    this.fetchTrends();
  }

  fetchMoviesByGenre() {
    this.tmdbService.getMoviesByGenre(this.genreId);
  }

  private fetchTrends(): void {
    this.tmdbService.getTrends();
  }
}
