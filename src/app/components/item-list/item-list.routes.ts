import { Routes } from '@angular/router';
import { ItemListResolver } from './route/item-list-routing-resolve.service';

const itemListRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/item-list.component').then((m) => m.ItemListComponent),
    data: {},
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./update/item-list-update.component').then(
        (m) => m.ItemListUpdateComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./update/item-list-update.component').then(
        (m) => m.ItemListUpdateComponent
      ),
    resolve: {
      itemList: ItemListResolver,
    },
  },
  {
    path: ':id/view',
    loadComponent: () =>
      import('./view/item-list-view.component').then(
        (m) => m.ItemListViewComponent
      ),
    resolve: {
      itemList: ItemListResolver,
    },
    
  },
];

export default itemListRoute;
