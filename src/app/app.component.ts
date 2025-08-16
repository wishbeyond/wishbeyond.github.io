import { APP_INITIALIZER, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationMenuComponent } from "./navigation-menu/navigation-menu.component";
import { FooterComponent } from "./footer/footer.component";
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-navigation-menu/>
    <div style="flex:1 1 100%">
      <router-outlet/>
    </div>
    <app-footer/>
  `,
  imports: [RouterOutlet, NavigationMenuComponent, FooterComponent],
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
