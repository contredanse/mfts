export interface IDataMenu {
  id: string;
  label: Label;
  level: number;
  pages?: (PagesEntity)[] | null;
  menu?: (MenuEntity)[] | null;
}
export interface Label {
  en: string;
  fr: string;
}
export interface PagesEntity {
  page_id: string;
  label: Label;
}
export interface MenuEntity {
  id: string;
  label: Label;
  pages?: (PagesEntity)[] | null;
  level: number;
}
