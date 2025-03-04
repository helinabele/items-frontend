import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItemList } from '../item-list.model';
import { ItemListService } from '../service/item-list.service';

const itemListResolve = (route: ActivatedRouteSnapshot): Observable<null | IItemList> => {
  const id = route.params.id;
  if (id) {
    return inject(ItemListService)
      .find(id)
      .pipe(
        mergeMap((itemList: HttpResponse<IItemList>) => {
          if (itemList.body) {
            return of(itemList.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default itemListResolve;
