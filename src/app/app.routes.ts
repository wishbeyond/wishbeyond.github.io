import { Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { AuthComponent } from './auth/auth.component';
import { WishlistsComponent } from './wishlists/wishlists.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { WishlistFormComponent } from './wishlist-form/wishlist-form.component';
import { WishlistUpdateFormComponent } from './wishlist-update-form/wishlist-update-form.component';

export const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'wishlists/create', component: WishlistFormComponent },
  { path: 'wishlists/:id/edit', component: WishlistUpdateFormComponent },
  { path: 'wishlists/:id', component: WishlistComponent },
  { path: 'wishlists', component: WishlistsComponent },
];
