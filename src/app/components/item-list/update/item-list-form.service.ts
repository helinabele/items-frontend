import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IItemList, NewItemList } from '../item-list.model';

type ItemListFormGroupInput = IItemList | Partial<NewItemList>;

type ItemListFormGroupContent = {
  id: FormControl<IItemList['id'] | NewItemList['id']>;
  title: FormControl<IItemList['title']>;
  body: FormControl<IItemList['body']>;
};

export type ItemListFormGroup = FormGroup<ItemListFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItemListFormService {
  createItemListFormGroup(
    itemList: ItemListFormGroupInput = { id: null }
  ): ItemListFormGroup {
    return new FormGroup<ItemListFormGroupContent>({
      id: new FormControl<string | null>({
        value: itemList.id ?? null,
        disabled: true,
      }),
      title: new FormControl(itemList.title, [Validators.required]),
      body: new FormControl(itemList.body),
    });
  }

  getItemList(form: ItemListFormGroup): IItemList | NewItemList {
    return form.getRawValue() as IItemList | NewItemList;
  }

  resetForm(form: ItemListFormGroup, itemList: ItemListFormGroupInput): void {
    form.reset({
      ...itemList,
      id: itemList.id ?? null,
    });

    form.controls.id.disable();
  }
}
