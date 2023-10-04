import { Injectable } from '@angular/core';
import { columns } from './data';
import { Column } from './models';

@Injectable()
export class ColumnsService {
  private data: Column[] = columns;
  private counter: number = columns.length;

  public columns(): Column[] {
    return this.data;
  }

  public remove(column: Column): void {
    const index = this.data.findIndex(({ id }) => id === column.id);
    this.data.splice(index, 1);
  }

  public save(column: Column, isNew: boolean): void {
    if (isNew) {
      column.id = this.counter++;
      this.data.splice(0, 0, column);
    } else {
      Object.assign(
        this.data.find(({ id }) => id === column.id),
        column
      );
    }
  }
}
