import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ItemListUpdateComponent } from './item-list-update.component';
import { ItemListService } from '../service/item-list.service';
import { ItemListFormService } from './item-list-form.service';
import { IItemList } from '../item-list.model';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';

describe('ItemListUpdateComponent', () => {
  let component: ItemListUpdateComponent;
  let fixture: ComponentFixture<ItemListUpdateComponent>;
  let itemListService: ItemListService;
  let itemListFormService: ItemListFormService;
  let activatedRoute: ActivatedRoute;
  let router: Router;

  const mockItemList: IItemList = {
    id: '1',
    title: 'Test Item',
    body: 'Test Description',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ItemListUpdateComponent,  // this is must here :)
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
      ],
      providers: [
        {
          provide: ItemListService,
          useValue: {
            create: jest.fn().mockReturnValue(of(new HttpResponse({ body: mockItemList }))),
            update: jest.fn().mockReturnValue(of(new HttpResponse({ body: mockItemList }))),
          },
        },
        {
          provide: ItemListFormService,
          useValue: {
            createItemListFormGroup: jest.fn().mockReturnValue(new FormGroup({
              id: new FormControl(null),
              title: new FormControl('Test Item', [Validators.required]),
              body: new FormControl('Test Description'),
            })),
            getItemList: jest.fn().mockReturnValue(mockItemList),
            resetForm: jest.fn(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ itemList: mockItemList }),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(ItemListUpdateComponent);
    component = fixture.componentInstance;
    itemListService = TestBed.inject(ItemListService);
    fixture.detectChanges();
    itemListFormService = TestBed.inject(ItemListFormService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
  });
  
  it('should initialize the form with existing item data', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component.editForm).toBeDefined();
    expect(itemListFormService.resetForm).toHaveBeenCalledWith(component.editForm, mockItemList);
  }));

  it('should save the item when form is valid', fakeAsync(() => {
    jest.spyOn(itemListService, 'update').mockReturnValue(of(new HttpResponse({ body: mockItemList })));
    jest.spyOn(router, 'navigate');
  
    component.save();
    tick();
    fixture.detectChanges();
  
    expect(itemListService.update).toHaveBeenCalledWith(mockItemList);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));
  
  it('should create a new item if there is no id', fakeAsync(() => {
    const newItem: IItemList = { id: null, title: 'New Item', body: 'New Description' };

    // Mock the create service call
    jest.spyOn(itemListService, 'create').mockReturnValue(of(new HttpResponse({ body: newItem })));
    jest.spyOn(router, 'navigate');

    component.itemList = null;

    component.editForm.setValue({
      title: 'New Item',
      body: 'New Description',
      id: null
    });

    component.save();
    tick();
    fixture.detectChanges();

    expect(itemListService.create).toHaveBeenCalledWith({
      title: 'New Item',
      body: 'New Description',
      id: null,  // id should be null when creating a new item
    });

    // this ... after create
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));
  it('should set isSaving to false when the save operation completes', fakeAsync(() => {
    jest.spyOn(itemListService, 'update').mockReturnValue(of(new HttpResponse({ body: mockItemList })));

    component.save();
    tick();
    fixture.detectChanges();

    expect(component.isSaving).toBe(false);
  }));

  it('should handle error if saving the item fails', fakeAsync(() => {
    jest
      .spyOn(itemListService, 'update')
      .mockReturnValue(throwError(() => new Error('Error saving item')));

    component.save();
    tick();
    fixture.detectChanges();

    expect(component.isSaving).toBe(false);
  }));

  it('should navigate to the "cancel" route when Cancel button is clicked', () => {
    jest.spyOn(router, 'navigate');

    const cancelButton = fixture.debugElement.nativeElement.querySelector('button[type="button"]');
    cancelButton.click();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
