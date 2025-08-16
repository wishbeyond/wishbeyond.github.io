import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../environments/environment';

export type WishlistPreview = {
  id: string;
  userId: string;
  name: string;
  amountOfItems: number;
  amountOfFulfilledItems: number;
  priority: number;
}

export enum VisibilityType {
  Private = 'private',
  Public = 'public',
  Link = 'link'
}

export enum UpdateType {
  Clear = 'clear',
  Update = 'update'
}

export type UpdateFieldData<T> = Clear | Update<T>

export type Clear = {
  type: UpdateType.Clear
}

export type Update<T> = {
  type: UpdateType.Update,
  value: T
}


export type WishlistDetail = {
  id: string;
  userId: string;
  name: string;
  items: WishlistItem[];
  priority: number;
  description?: string;
  visibilityType: VisibilityType;
}

export type CreateWishlistRequest = {
  name: string;
  description?: string;
  visibilityType: VisibilityType;
  items: CreateWishlistItemRequest[];
  priority: number;
}

export type CreateWishlistItemRequest = {
  name: string;
  description?: string;
  links: string[];
  image?: string;
  priority: number;
}

export type UpdateWishlistRequest = {
  name?: string,
  description?: UpdateFieldData<string>,
  visibilityType?: VisibilityType,
  priority?: number,
  itemsToDelete: string[],
  itemsToCreate: CreateWishlistItemRequest[],
  itemsToUpdate: UpdateWishlistItemRequest[],
}

export type UpdateWishlistItemRequest = {
  id: string,
  name?: string,
  description?: UpdateFieldData<string>,
  links?: UpdateFieldData<string[]>,
  image?: UpdateFieldData<string>,
  priority?: number,
}

export type WishlistItem = {
  id: string;
  name: string;
  isFulfilled: boolean;
  description?: string;
  links?: string[];
  image?: string;
  priority: number;
}

export type WishlistCreatedResponse = {
  id: string;
  itemIds: string[];
}

export type WishlistUpdatedResponse = {
  itemIds: string[],
}

@Injectable({
  providedIn: 'root',
})
export class WishlistsService {
  private baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) { }

  private readonly _wishlists: WritableSignal<WishlistPreview[]> = signal([])
  private readonly _currentWishlist: WritableSignal<WishlistDetail | null> = signal(null)

  wishlists = computed(() => this._wishlists())
  currentWishlist = computed(() => this._currentWishlist())

  getWishlists(): Observable<WishlistPreview[]> {
    return this.http.get<WishlistPreview[]>(`${this.baseUrl}/wishlists`).pipe(
      tap(response => this._wishlists.set(response)),
      catchError(err => {
        console.log(err)
        this._wishlists.set([]);
        return of([]);
      })
    );
  }

  getWishlistById(id: string): Observable<WishlistDetail | null> {
    return this.http.get<WishlistDetail>(`${this.baseUrl}/wishlists/${id}`).pipe(
      tap(response => this._currentWishlist.set(response)),
      catchError(err => {
        console.log(err)
        this._currentWishlist.set(null);
        return of(null);
      })
    );
  }

  deleteWishlistById(id: String): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/wishlists/${id}`).pipe(
      map(() => true)
    )
  }

  createWishlist(wishlist: CreateWishlistRequest): Observable<WishlistCreatedResponse> {
    return this.http.post<WishlistCreatedResponse>(`${this.baseUrl}/wishlists`, wishlist)
  }

  updateWishlist(wishlist: UpdateWishlistRequest): Observable<WishlistUpdatedResponse> {
    const id = this.currentWishlist()?.id
    if (!id)
      throw new Error("NIHOOOYA SEBE")
    return this.http.put<WishlistUpdatedResponse>(`${this.baseUrl}/wishlists/${id}`, wishlist)
  }
}
