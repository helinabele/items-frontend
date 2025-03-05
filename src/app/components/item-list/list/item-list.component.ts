import { Component, OnInit, inject } from '@angular/core';
import { ItemListService } from '../service/item-list.service';
import { IItemList } from '../item-list.model';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
})
export class ItemListComponent implements OnInit {
  items: IItemList[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  private itemListService = inject(ItemListService);
  public router = inject(Router);

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading = true;
    this.itemListService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error fetching items.';
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  viewItem(id: string | null): void {
    this.router.navigate(['/', id, 'view']);
  }

  deleteItem(id: string | null): void {
    if (!confirm('Are you sure you want to delete this item?')) return;

    this.itemListService.delete(Number(id)).subscribe({
      next: () => {
        this.items = this.items.filter((item) => item.id !== id);
      },
      error: (err) => console.error('Error deleting item:', err),
    });
  }
}
