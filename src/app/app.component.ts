import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'netflix-clone';

  faIconLibrary = inject(FaIconLibrary);

  ngOnInit(): void {
      this.initFontAwesome();
  }

  private initFontAwesome(){
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }
}
