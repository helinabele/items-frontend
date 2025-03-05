import { Component, inject } from '@angular/core';
import { IItemList } from '../item-list.model';
import { ItemListService } from '../service/item-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-list-view',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './item-list-view.component.html'
})
export class ItemListViewComponent {
  item: IItemList | null = null;
  isLoading = false;
  errorMessage = '';

  private itemListService = inject(ItemListService);
  private activatedRoute = inject(ActivatedRoute);
  protected router = inject(Router);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadItem(id);
      }
    });
  }

  loadItem(id: number): void {
    this.isLoading = true;
    this.itemListService.getById(id).subscribe({
      next: (data) => {
        this.item = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load item details';
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
