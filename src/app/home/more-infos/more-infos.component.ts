import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { TmdbService } from '../../service/tmdb.service';
import { Movie } from '../../service/model/movie.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-more-infos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './more-infos.component.html',
  styleUrl: './more-infos.component.scss'
})
export class MoreInfosComponent implements OnInit, OnDestroy {


  public movieId: number = -1;

  tmdbService = inject(TmdbService);

  movie: Movie | undefined;

  constructor(){
    effect(() => {
      this.movie = this.tmdbService.moviesById().value;
    });
  }

  ngOnInit(): void {
    this.getMovieById();
  }

  getMovieById(): void{
    this.tmdbService.getMovieById(this.movieId);
  }

  ngOnDestroy(): void {
    this.tmdbService.clearGetMovieById();
  }

}
