import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WishlistPreview, WishlistsService } from '../wishlists.service';
import { WishlistPreviewComponent } from "../wishlist-preview/wishlist-preview.component";

@Component({
  selector: 'app-wishlists',
  templateUrl: './wishlists.component.html',
  styleUrls: ['./wishlists.component.css'],
  imports: [WishlistPreviewComponent],
  standalone: true,
})
export class WishlistsComponent implements OnInit {
  service = inject(WishlistsService)
  router = inject(Router)

  ngOnInit() {
    this.fetchWishlists();
  }

  fetchWishlists(): void {
    this.service.getWishlists().subscribe();
  }

  routeToCreate(): void {
    this.router.navigate(['wishlists/create'])
  }
}
