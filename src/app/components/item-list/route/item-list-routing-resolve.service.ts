import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { IItemList } from '../item-list.model';
import { ItemListService } from '../service/item-list.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ItemListResolver implements Resolve<IItemList> {
  constructor(private service: ItemListService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItemList> {
    const id = route.params['id'];
    return this.service.getById(id);
  }
}
