import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.css'
})
export class NavigationMenuComponent {
  authService = inject(AuthService); // Dependency Injection
  private router = inject(Router); // Dependency Injection

  constructor() {}

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {this.router.navigate(['/']);}, 
      error: () => {alert("Ашыпка при логауте, сам в ахуе!");},
    })
  }
}
