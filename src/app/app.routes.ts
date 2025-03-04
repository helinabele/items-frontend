import { Routes } from '@angular/router';
import { ItemListComponent } from './components/item-list/list/item-list.component';
import { ItemListUpdateComponent } from './components/item-list/update/item-list-update.component';

export const routes: Routes = [
  { path: '', component: ItemListComponent },
  { path: 'new', component: ItemListUpdateComponent },  
  { path: ':id/edit', component: ItemListUpdateComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } 
];
