import { Component, OnInit, effect, inject } from '@angular/core';
import { TmdbService } from '../../service/tmdb.service';
import { Genre } from '../../service/model/movie.model';
import { GenresResponse } from '../../service/model/genre.model';
import { MovieListComponent } from "./movie-list/movie-list.component";

@Component({
    selector: 'app-movie-selector',
    standalone: true,
    templateUrl: './movie-selector.component.html',
    styleUrl: './movie-selector.component.scss',
    imports: [MovieListComponent]
})
export class MovieSelectorComponent implements OnInit {

  tmdbService: TmdbService = inject(TmdbService);

  genres: Genre[] | undefined;

  constructor(){
    effect(() => {
      let genresResponse: GenresResponse = this.tmdbService.genres().value ?? {genres: []} as GenresResponse;
      this.genres = genresResponse.genres;

    })
  }

  ngOnInit(): void {
      this.fetchAllGenres();
  }

  private fetchAllGenres(): void {
    this.tmdbService.getAllGenres();
  }
}
