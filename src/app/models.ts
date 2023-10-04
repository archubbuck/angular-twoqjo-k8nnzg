export class Field {
  public id: number;
  public name: string;
  public description?: string;
}

export interface Column {
  id: number;
  fieldId?: number;
}
