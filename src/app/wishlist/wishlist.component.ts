import { Component, inject, OnInit } from '@angular/core';
import { WishlistsService } from '../wishlists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { WishlistItemComponent } from "../wishlist-item/wishlist-item.component";

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [WishlistItemComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {

  service = inject(WishlistsService)
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)

  ngOnInit(): void {
    this.activatedRoute.params.pipe(switchMap(({ id }) => this.service.getWishlistById(id))).subscribe()
  }

  delete(): void {
    this.activatedRoute.params.pipe(switchMap(({ id }) => this.service.deleteWishlistById(id)))
      .subscribe(() => this.router.navigate(['/wishlists']));
  }

  edit(): void {
    this.router.navigate([`wishlists/${this.service.currentWishlist()?.id}/edit`])
  }

}
