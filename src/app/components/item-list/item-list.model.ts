export interface IItemList {
  id: string | null;
  title?: string | null;
  body?: string | null;
}

export type NewItemList = Omit<IItemList, 'id'> & { id: null };
