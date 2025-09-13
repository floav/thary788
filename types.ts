
export interface Item {
  id: number;
  item: string;
  size: string;
  weight: string;
  quantity: string;
}

export interface SubItem {
  id: string;
  name: string;
}

export interface Category {
  name: string;
  subItems: SubItem[];
}
