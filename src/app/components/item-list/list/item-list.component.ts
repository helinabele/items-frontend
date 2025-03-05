import { Component, OnInit, inject } from '@angular/core';
import { ItemListService } from '../service/item-list.service';
import { IItemList } from '../item-list.model';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from '../delete/delete-dialog.component';
@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, DeleteDialogComponent],
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
})
export class ItemListComponent implements OnInit {
  items: IItemList[] = [];
  filteredItems: IItemList[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  searchText = '';
  sortColumn: keyof IItemList = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage = 1;
  itemsPerPage = 5;

  showDeleteDialog = false;
  itemToDelete: string | null = null;

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
        this.applyFilterAndSort();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error fetching items.';
        console.error(err);
        this.isLoading = false;
      },
    });
  }

applyFilterAndSort(): void {
    let filtered = this.items;

    if (this.searchText.trim()) {
      filtered = filtered.filter((item) =>
        [item.title, item.body]
          .map((field) => field?.toLowerCase() ?? '')
          .some((text) => text.includes(this.searchText.toLowerCase()))
      );
    }

    filtered.sort((a, b) => {
      const valueA = a[this.sortColumn] ?? '';
      const valueB = b[this.sortColumn] ?? '';
      return this.sortDirection === 'asc'
        ? valueA.toString().localeCompare(valueB.toString())
        : valueB.toString().localeCompare(valueA.toString());
    });

    this.filteredItems = filtered;
  }

  
  toggleSort(column: keyof IItemList): void {
    this.sortColumn = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilterAndSort();
  }

  filterItems(): void {
    this.applyFilterAndSort();
  }
  clearSearch(): void {
    this.searchText = '';
    this.applyFilterAndSort();
  }

  getPaginatedItems(): IItemList[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredItems.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.filteredItems.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  get totalPages(): number {
    return Math.ceil(this.filteredItems.length / this.itemsPerPage);
  }

  addItem(): void {
    this.router.navigate(['new']);
  }

  viewItem(id: string | null): void {
    this.router.navigate(['/', id, 'view']);
  }

  openDeleteDialog(id: string | null): void {
    console.log('Opening delete dialog for item:', id);
    this.itemToDelete = id;
    this.showDeleteDialog = true;
  }
  
  
  
  delete(itemList: IItemList): void {
    this.itemListService.delete(itemList.id).subscribe({
      next: () => {
        this.items = this.items.filter(item => item.id !== itemList.id);
        this.applyFilterAndSort();
      },
      error: (err) => console.error('Error deleting item:', err),
    });
  }
  
  confirmDelete(id: string | null): void {
    this.itemListService.delete(id).subscribe({
      next: () => {
        this.items = this.items.filter(item => item.id !== id);
        this.applyFilterAndSort();
        this.showDeleteDialog = false;
      },
      error: (err) => console.error('Error deleting item:', err),
    });
  }
  
  cancelDelete(): void {
    this.showDeleteDialog = false;
  }
  
}
