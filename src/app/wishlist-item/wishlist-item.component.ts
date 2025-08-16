import { Component, input } from '@angular/core';
import { WishlistItem } from '../wishlists.service';

@Component({
  selector: 'app-wishlist-item',
  standalone: true,
  imports: [],
  templateUrl: './wishlist-item.component.html',
  styleUrl: './wishlist-item.component.css'
})
export class WishlistItemComponent {
  wishlistItem = input.required<WishlistItem>()
}
