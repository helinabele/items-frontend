import { Routes } from '@angular/router';
import { ItemListComponent } from './components/item-list/list/item-list.component';
import { ItemListUpdateComponent } from './components/item-list/update/item-list-update.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import(`./components/item-list/item-list.routes`),
  },
];
