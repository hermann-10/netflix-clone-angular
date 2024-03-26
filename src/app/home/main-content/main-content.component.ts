import { Component, effect, OnInit, inject } from '@angular/core';
import { TmdbService } from '../../service/tmdb.service';
import { Genres, Movie, MovieApiResponse } from '../../service/model/movie.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent implements OnInit {

  tmdbService: TmdbService = inject(TmdbService);

  trendMovie: Movie | undefined;

  genres: Genres = [];


  constructor(){
    effect(() => {
      const trendMovieResponse: MovieApiResponse | undefined = this.tmdbService.fetchTrendMovie().value;
      if(trendMovieResponse){
        this.trendMovie = trendMovieResponse.results[0];
      }
    })
  }

  ngOnInit(){
    //this.tmdbService.getGenres().subscribe((genres) => (this.genres = genres));
    this.fetchMovieTrends();
  }

  fetchMovieTrends(): void {
    this.tmdbService.getTrends();
    //this.tmdbService.getTrends1();
  }
}
