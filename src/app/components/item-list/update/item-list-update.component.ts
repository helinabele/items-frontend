import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IItemList } from '../item-list.model';
import { ItemListService } from '../service/item-list.service';
import {
  ItemListFormService,
  ItemListFormGroup,
} from './item-list-form.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  selector: 'app-item-list-update',
  templateUrl: './item-list-update.component.html',
})
export class ItemListUpdateComponent implements OnInit {
  [x: string]: any;
  isSaving = false;
  itemList: IItemList | null = null;

  private itemListService = inject(ItemListService);
  private itemListFormService = inject(ItemListFormService);
  private activatedRoute = inject(ActivatedRoute);
  protected router = inject(Router);

  editForm!: ItemListFormGroup;

  ngOnInit(): void {
    this.editForm = this.itemListFormService.createItemListFormGroup();

    this.activatedRoute.data.subscribe(({ itemList }) => {
      if (itemList) {
        this.itemList = itemList;
        this.updateForm(itemList); // Populate form for edit
      } else {
        // Create a new item, set default values
        this.itemList = { id: null, title: '', body: '' }; // Default values for new item
        this.updateForm(this.itemList);
      }
    });

  }

  save(): void {
    this.isSaving = true;
    const itemList = this.itemListFormService.getItemList(this.editForm);

    console.log('Form Values:', itemList); // To see the mock data

    const saveOperation: Observable<HttpResponse<IItemList>> = itemList.id
      ? this.itemListService.update(itemList)
      : this.itemListService.create(itemList);

    saveOperation.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => this.onSaveSuccess(),
      error: (error) => console.error('Error saving item:', error),
    });
  }

  private onSaveSuccess(): void {
    this.router.navigate(['/']);
  }

  private updateForm(itemList: IItemList): void {
    this.itemListFormService.resetForm(this.editForm, itemList);
  }
}
