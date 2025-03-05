import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IItemList, NewItemList } from '../item-list.model';

@Injectable({ providedIn: 'root' })
export class ItemListService {
  private readonly http = inject(HttpClient);
  private readonly resourceUrl = 'https://jsonplaceholder.typicode.com/posts';

  getAll(): Observable<IItemList[]> {
    return this.http
      .get<IItemList[]>(this.resourceUrl)
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<IItemList> {
    return this.http
      .get<IItemList>(`${this.resourceUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  update(itemList: IItemList): Observable<HttpResponse<IItemList>> {
    return this.http.put<IItemList>(
      `${this.resourceUrl}/${itemList.id}`,
      itemList,
      { observe: 'response' }
    );
  }

  create(itemList: IItemList): Observable<HttpResponse<IItemList>> {
    console.log('Creating item:', itemList);
    return this.http.post<IItemList>(this.resourceUrl, itemList, {
      observe: 'response',
    });
  }

  delete(id: string | null): Observable<void> {
    return this.http
      .delete<void>(`${this.resourceUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(
      () => new Error('Something went wrong. Please try again later.')
    );
  }
}
