import { Component, inject, Input } from '@angular/core';
import { WishlistPreview, WishlistsService } from '../wishlists.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-wishlist-preview',
  standalone: true,
  imports: [],
  templateUrl: './wishlist-preview.component.html',
  styleUrl: './wishlist-preview.component.css', 
  host: {"(click)": "viewWishlist()"}
})
export class WishlistPreviewComponent {
  private service = inject(WishlistsService)
  private router = inject(Router)
  @Input() wishlistPreview!: WishlistPreview

  deleteWishlist(): void {
    this.service.deleteWishlistById(this.wishlistPreview.id).pipe(switchMap(() => this.service.getWishlists())).subscribe()
  }

  viewWishlist(): void {
    this.router.navigate(['/wishlists', this.wishlistPreview.id]);
  }
}
