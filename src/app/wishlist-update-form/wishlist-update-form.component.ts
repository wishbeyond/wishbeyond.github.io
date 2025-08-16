import { Component, inject } from '@angular/core';
import { VisibilityType, CreateWishlistRequest, WishlistsService, UpdateWishlistItemRequest, CreateWishlistItemRequest, UpdateWishlistRequest, UpdateFieldData, UpdateType } from '../wishlists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { deepEquals } from '../utils';

@Component({
  selector: 'app-wishlist-update-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './wishlist-update-form.component.html',
  styleUrl: './wishlist-update-form.component.css'
})
export class WishlistUpdateFormComponent {
  route = inject(ActivatedRoute);
  wishlistsService = inject(WishlistsService);
  router = inject(Router);

  visibilityTypes = Object.values(VisibilityType);

  form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true }),
    description: new FormControl<string>('', { nonNullable: true }),
    visibilityType: new FormControl<VisibilityType>(VisibilityType.Public, { nonNullable: true }),
    items: new FormArray([] as FormControl<LocalItem>[]),
    priority: new FormControl<number>(1, { nonNullable: true }),
  });

  itemsToDelete: string[] = []
  itemsToCreate: string[] = []

  initForm() {
    const { id, userId, ...current } = this.wishlistsService.currentWishlist()!

    current.items.forEach(item => {
      const itemForm = this.createItemControl(item.id)
      const linksForm = itemForm.get('links') as FormArray
      item.links?.forEach(link => linksForm.push(new FormControl('')))
      this.items.push(itemForm)
    })

    this.form.setValue(
      {
        ...current,
        description: current.description ? current.description : '',
        items: current.items.map(({ isFulfilled, ...item }) => ({
          ...item,
          description: item.description ? item.description : '',
          links: item.links?.length ? item.links : [],
          image: item.image ? item.image : ''
        }))
      }
    )
  }

  ngOnInit(): void {
    const wishlist = this.wishlistsService.currentWishlist()

    if (!wishlist) {
      this.route.params.pipe(switchMap(({ id }) => this.wishlistsService.getWishlistById(id))).subscribe(() => this.initForm())
      return
    }

    this.initForm()
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private createItemControl(id?: string): FormGroup {
    return new FormGroup({
      id: new FormControl<string>(id ? id : crypto.randomUUID() as string, { nonNullable: true }),
      name: new FormControl<string>('', { nonNullable: true }),
      description: new FormControl<string>('', { nonNullable: true }),
      links: new FormArray([]),
      image: new FormControl<string>('', { nonNullable: true }),
      priority: new FormControl<number>(0, { nonNullable: true }),
    });
  }

  addItem(): void {
    const itemForm = this.createItemControl()

    this.itemsToCreate.push(itemForm.value.id)

    this.items.push(itemForm);
  }

  removeItem(index: number): void {
    const item = this.items.value[index]
    if (this.itemsToCreate.includes(item.id))
      this.itemsToCreate = this.itemsToCreate.filter((id) => id != item.id)
    else
      this.itemsToDelete.push(item.id)

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

  makeUpdateFieldData<T>(value: T | null | undefined): UpdateFieldData<T> {
    if (!value)
      return { type: UpdateType.Clear }
    else
      return { type: UpdateType.Update, value }
  }

  extractRequest(): [LocalItem[], Omit<UpdateWishlistRequest, 'itemsToDelete' | 'itemsToCreate' | 'itemsToUpdate'>] {
    const current = this.wishlistsService.currentWishlist()
    if (!current) {
      console.error(`Modifying empty wishlist`)
      throw new Error('Modifying empty wishlist')
    }
    const data = this.form.value
    let result: Omit<UpdateWishlistRequest, 'itemsToDelete' | 'itemsToCreate' | 'itemsToUpdate'> = {}

    if (this.checkBoth(data.name, current.name))
      result['name'] = data['name']

    if (this.checkBoth(data.priority, current.priority))
      result['priority'] = data['priority']

    if (this.checkBoth(data.visibilityType, current.visibilityType))
      result['visibilityType'] = data['visibilityType']

    if (this.checkBoth(data.description, current.description))
      result['description'] = this.makeUpdateFieldData(data['description'])

    return [data['items'], result] as [LocalItem[], Omit<UpdateWishlistRequest, 'itemsToDelete' | 'itemsToCreate' | 'itemsToUpdate'>]
  }

  private localToCreated(item: LocalItem): CreateWishlistItemRequest {
    let { id, description, image, ...preResult } = item
    let result: CreateWishlistItemRequest = preResult

    if (description) result['description'] = description
    if (image) result['image'] = image

    return result
  }

  private checkBoth(first: any, second: any): boolean {
    return !deepEquals(first, second) && (first?.length || second?.length)
  }

  private localToUpdated(item: LocalItem): UpdateWishlistItemRequest {
    const current = this.wishlistsService.currentWishlist()
    if (!current) {
      console.error(`Modifying empty wishlist`)
      throw new Error('Modifying empty wishlist')
    }
    const thisItem = current.items.find(({ id }) => id === item.id)
    if (!thisItem) {
      console.error(`Modifying non-existent item`)
      throw new Error(`Modifying non-existent item`)
    }

    let result: UpdateWishlistItemRequest = { id: item.id }

    if (this.checkBoth(item.name, thisItem.name))
      result.name = item.name
    if (this.checkBoth(item.description, thisItem.description))
      result.description = this.makeUpdateFieldData(item.description)
    if (this.checkBoth(item.links, thisItem.links))
      result.links = this.makeUpdateFieldData(item.links)
    if (this.checkBoth(item.image, thisItem.image))
      result.image = this.makeUpdateFieldData(item.image)
    if (this.checkBoth(item.priority, thisItem.priority))
      result.priority = item.priority

    return result
  }

  private makeRequest(): UpdateWishlistRequest {
    const [items, partialRequest] = this.extractRequest()

    return {
      ...partialRequest,
      itemsToDelete: this.itemsToDelete,
      itemsToCreate: items.filter(({ id }) => this.itemsToCreate.includes(id)).map(this.localToCreated.bind(this)),
      itemsToUpdate: items.filter(({ id }) => !this.itemsToCreate.includes(id)).map(this.localToUpdated.bind(this)),
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return
    }
    console.log('Submitting wishlist:', this.form.value);
    this.wishlistsService.updateWishlist(this.makeRequest()).subscribe(() => {
      this.router.navigate([`wishlists/${this.wishlistsService.currentWishlist()?.id}`]);
    })
  }
}

type LocalItem = {
  id: string,
  name: string;
  description: string;
  links: string[];
  image: string;
  priority: number;
}
