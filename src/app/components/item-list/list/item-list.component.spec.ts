import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { ItemListComponent } from './item-list.component';
import { ItemListService } from '../service/item-list.service';
import { IItemList } from '../item-list.model';

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let itemListService: ItemListService;
  let router: Router;

  const mockItems: IItemList[] = [
    { id: '1', title: 'Item 1', body: 'Description 1' },
    { id: '2', title: 'Item 2', body: 'Description 2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemListComponent, HttpClientTestingModule], // Add HttpClientTestingModule
      providers: [
        ItemListService,
        { provide: Router, useValue: { navigate: jest.fn() } }, // Mock Router
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
    itemListService = TestBed.inject(ItemListService);
    router = TestBed.inject(Router);
  });

  it('should load items on init', fakeAsync(() => {
    jest.spyOn(itemListService, 'getAll').mockReturnValue(of(mockItems));

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(itemListService.getAll).toHaveBeenCalled();
    expect(component.items).toEqual(mockItems);
  }));

  it('should handle error if loading items fails', fakeAsync(() => {
    jest
      .spyOn(itemListService, 'getAll')
      .mockReturnValue(throwError(() => new Error('Error fetching items')));

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Error fetching items.');
  }));

  it('should delete an item', fakeAsync(() => {
    const itemIdToDelete = '1';
  
    // Mock the delete service call to return an observable
    jest.spyOn(itemListService, 'delete').mockReturnValue(of(undefined));
  
    // Mock window.confirm to return true (simulating user confirming the delete)
    jest.spyOn(window, 'confirm').mockReturnValue(true);
  
    // Initial items
    component.items = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
    ];
  
    // Call the delete method
    component.delete({ id: itemIdToDelete, title: 'Item 1', body: '' }); // Passing an IItemList object
    tick(); 
    fixture.detectChanges();
  
    expect(itemListService.delete).toHaveBeenCalledWith(itemIdToDelete);
  
    expect(component.items.length).toBe(1);
    expect(component.items[0].id).toBe('2');
  }));
  

it('should not delete an item if user cancels the confirmation', fakeAsync(() => {
  const itemListToDelete: IItemList = { id: '1', title: 'Test Item', body: 'Description of item' }; // Create the mock IItemList object
  jest.spyOn(window, 'confirm').mockReturnValue(false);
  jest.spyOn(itemListService, 'delete');

  component.delete(itemListToDelete); 
  tick(); 
  fixture.detectChanges();

  expect(itemListService.delete).not.toHaveBeenCalled();
}));


  it('should navigate to the "new" item page when Add New Item button is clicked', () => {
    jest.spyOn(router, 'navigate');

    component.router.navigate(['new']);

    expect(router.navigate).toHaveBeenCalledWith(['new']);
  });
});
