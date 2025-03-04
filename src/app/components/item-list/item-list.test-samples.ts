import { IItemList, NewItemList } from './item-list.model';

export const sampleWithRequiredData: IItemList = {
  id: '0df3b4b1-85d6-46f9-836c-099dcd3d864d',
  title: 'siege',
};

export const sampleWithPartialData: IItemList = {
  id: '6b888b13-92de-41e3-a251-efeac1266d0b',
  title: 'athwart moor',
};

export const sampleWithFullData: IItemList = {
  id: '317920ad-2dd6-40ab-878e-0ed7e4afa54b',
  title: 'pfft',
  body: 'sate',
};

export const sampleWithNewData: NewItemList = {
  title: 'pace disadvantage lovingly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
