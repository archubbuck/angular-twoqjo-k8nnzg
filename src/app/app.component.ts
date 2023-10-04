import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColumnsService } from './columns.service';
import { fields } from './data';
import {
  AddEvent,
  CancelEvent,
  EditEvent,
  RemoveEvent,
  SaveEvent,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { Column, Field } from './models';

@Component({
  selector: 'my-app',
  template: `
        <kendo-grid
            [kendoGridBinding]="gridData"
            (edit)="editHandler($event)"
            (cancel)="cancelHandler($event)"
            (save)="saveHandler($event)"
            (remove)="removeHandler($event)"
            (add)="addHandler($event)"
            [rowReorderable]="true"
            [reorderable]="true"
            [height]="410"
        >
            <ng-template kendoGridToolbarTemplate>
                <button kendoGridAddCommand>Add new</button>
            </ng-template>
            <kendo-grid-rowreorder-column [width]="40"></kendo-grid-rowreorder-column>
            <kendo-grid-column field="fieldId" title="Field" [width]="150">
                <ng-template kendoGridEditTemplate let-dataItem="dataItem" let-formGroup="formGroup">
                    <kendo-dropdownlist
                        [data]="fields"
                        textField="name"
                        valueField="id"
                        [valuePrimitive]="true"
                        [formControl]="formGroup.get('fieldId')"
                    >
                    </kendo-dropdownlist>
                </ng-template>
                <ng-template kendoGridCellTemplate let-dataItem>
                    <kendo-dropdownlist
                        [data]="fields"
                        textField="name"
                        valueField="id"
                        [valuePrimitive]="true"
                        [value]="dataItem.fieldId"
                        (valueChange)="onValueChange($event, dataItem)"
                    >
                    </kendo-dropdownlist>
                </ng-template>
            </kendo-grid-column>
            
            <kendo-grid-command-column title="command" [width]="220">
                <ng-template kendoGridCellTemplate let-isNew="isNew">
                    
                    <button kendoGridRemoveCommand>Remove</button>
                    <button kendoGridSaveCommand [disabled]="formGroup?.invalid">
                        {{ isNew ? 'Add' : 'Update' }}
                    </button>
                    <button kendoGridCancelCommand>
                        {{ isNew ? 'Discard changes' : 'Cancel' }}
                    </button>
                </ng-template>
            </kendo-grid-command-column>
        </kendo-grid>
    `,
})
export class AppComponent implements OnInit {
  public gridData: Column[];
  public fields: Field[] = fields;
  public formGroup: FormGroup;
  private editedRowIndex: number;

  constructor(private service: ColumnsService) {}

  public ngOnInit(): void {
    const cols = this.service.columns();
    console.log(cols);
    this.gridData = cols;
  }

  public field(id: number): Field {
    return this.fields.find((x) => x.id === id);
  }

  public addHandler({ sender }: AddEvent): void {
    this.closeEditor(sender);

    this.formGroup = createFormGroup({});

    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
    this.closeEditor(sender);

    this.formGroup = createFormGroup(dataItem);

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }: CancelEvent): void {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    const column = formGroup.value;

    this.service.save(column, isNew);

    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem }: RemoveEvent): void {
    this.service.remove(dataItem);
  }

  public onValueChange(e, item) {
    item.fieldId = e;
    this.service.save(item, false);
  }

  private closeEditor(
    grid: GridComponent,
    rowIndex = this.editedRowIndex
  ): void {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
}

const createFormGroup = (dataItem) =>
  new FormGroup({
    id: new FormControl(dataItem.id),
    fieldId: new FormControl(dataItem.fieldId, Validators.required),
  });
