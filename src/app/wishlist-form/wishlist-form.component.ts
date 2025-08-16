import { Component, inject } from '@angular/core';
import { VisibilityType, CreateWishlistRequest, WishlistsService } from '../wishlists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-wishlist-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './wishlist-form.component.html',
  styleUrl: './wishlist-form.component.css'
})
export class WishlistFormComponent {
  wishlistsService = inject(WishlistsService);
  route = inject(ActivatedRoute);
  router = inject(Router)

  visibilityTypes = Object.values(VisibilityType);

  form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true }),
    description: new FormControl<string>(''),
    visibilityType: new FormControl<VisibilityType>(VisibilityType.Public, { nonNullable: true }),
    items: new FormArray([]),
    priority: new FormControl<number>(1, { nonNullable: true }),
  });

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private createItemControl(): FormGroup {
    return new FormGroup({
      name: new FormControl<string>('', { nonNullable: true }),
      description: new FormControl<string>(''),
      links: new FormArray([]),
      image: new FormControl<string>(''),
      priority: new FormControl<number>(0, { nonNullable: true }),
    });
  }

  addItem(): void {
    this.items.push(this.createItemControl());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  addLink(itemIndex: number): void {
    const item = this.items.at(itemIndex) as FormGroup;
    (item.get('links') as FormArray).push(new FormControl<string>(''));
  }

  getLinks(itemControl: AbstractControl): FormArray {
    return itemControl.get('links') as FormArray
  }

  removeLink(itemIndex: number, linkIndex: number): void {
    const item = this.items.at(itemIndex) as FormGroup;
    (item.get('links') as FormArray).removeAt(linkIndex);
  }

  private fixUndefined(value: any) {
    return value ? value : null
  }

  private prepareForCreation(data: CreateWishlistRequest): CreateWishlistRequest {
    return {
      ...data,
      description: this.fixUndefined(data.description),
      items: data.items.map((item) => ({
        ...item,
        description: this.fixUndefined(item.description),
        image: this.fixUndefined(item.image),
      })),
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return
    }
    console.log('Submitting wishlist:', this.form.value);
    this.wishlistsService.createWishlist(this.prepareForCreation(this.form.value as CreateWishlistRequest)).subscribe(resp => {
      console.log('Wishlist saved successfully!');
      this.router.navigate([`wishlists/${resp?.id}`])
    })
  }
}
