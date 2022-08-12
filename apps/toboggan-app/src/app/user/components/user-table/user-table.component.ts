/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component } from '@angular/core';
import {
  SingleHeaderRowTableDataGenerator,
  TableColumnDisplayMetadatum,
  TableColumnSortStateEnum,
  TableDataGenerator,
  TableRow,
} from '@snhuproduct/toboggan-ui-components-library';
import { IRowActionEvent } from '@snhuproduct/toboggan-ui-components-library/lib/table/row-action-event.interface';
import { IUpdatedUser, IUser } from '@toboggan-ws/toboggan-common';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../../shared/services/user/user.service';
import { userTableHeader } from './data/user-table-header';
import {
  ICellRowData,
  IFilterChange,
  ITableRow,
  RowActions,
} from './user-table.types';

@Component({
  selector: 'toboggan-ws-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent {
  private currentPage = 1;
  private resultsPerPage = 10;
  dynamicRowData: TableRow[] = [];

  private users: IUser[] = [];

  private filters: Map<string, Record<string, boolean>> = new Map();

  constructor(private userService: UserService) {}

  dataGenerator: SingleHeaderRowTableDataGenerator =
    new SingleHeaderRowTableDataGenerator(
      async (
        dataGenerator: TableDataGenerator,
        columnDisplayMetadata: TableColumnDisplayMetadatum[],
        searchString: string,
        pageSize: number,
        currentPage: number
      ) => {
        dataGenerator.isFiltered = true;

        const { sortColumnDataKey, sortDirectionCoefficient } =
          this.getSortDirectionCoefficient(columnDisplayMetadata);

        await this.generateUserRowData();

        if (this.dynamicRowData.length) {
          const sortedData = this.getSortedData(
            sortColumnDataKey,
            sortDirectionCoefficient
          );
          const startRow = (currentPage - 1) * pageSize;
          const pageData = sortedData.slice(startRow, startRow + pageSize);
          dataGenerator.retrievalCallback(
            pageData,
            sortedData.length,
            currentPage,
            Math.ceil(sortedData.length / pageSize)
          );
        } else {
          dataGenerator.update();
        }
      },
      () => {},
      userTableHeader
    );

  getActionMenuItems(rowData: TableRow) {
    const cellData = rowData.cellData as Record<string, any>;

    const actions = ['edit', 'reset password'];

    // we're using a tag on this format for the status: ['is-category', 'Active', 50]
    // that's why we're using index 1 here.
    if (cellData['status'][1]?.toString().toLowerCase() === 'active') {
      actions.push('deactivate');
    } else {
      actions.push('activate');
    }

    actions.push('cancel'); // cancel should come last!

    return actions;
  }

  onRowAction(event: IRowActionEvent) {
    const { action, rowId } = event;

    const rowData = this.dynamicRowData.find(
      (row) => row.rowId === rowId
    ) as ITableRow;

    if (!rowData) {
      throw new Error('Could not find rowData for rowId: ' + rowId);
    }
    const { first, last, mail } = rowData.cellData as unknown as ICellRowData;

    const userId = rowData.id;

    const userPayload: Omit<IUpdatedUser, 'id' | 'enabled'> = {
      firstName: first,
      lastName: last,
      email: mail[1],
    };

    switch (action) {
      case RowActions.Activate:
        console.log('Activating user...');

        this.userService.updateUser(
          {
            ...userPayload,
            enabled: true,
          },
          userId
        );

        this.refreshTableData();

        break;
      case RowActions.Deactivate:
        console.log('Deactivating user...');

        this.userService.updateUser(
          {
            ...userPayload,
            enabled: false,
          },
          userId
        );

        this.refreshTableData();

        break;

      case RowActions.ResetPassword:
      case RowActions.Edit:
        throw new Error('RowAction not implemented yet');
      case RowActions.Cancel:
        // just close the menu!
        break;
    }
  }

  async generateUserRowData(): Promise<void> {
    const users = await firstValueFrom(this.userService.fetchUsers());

    this.users = users;

    // TODO: Ideally it should come sorted from our API!
    const usersSortedByLastName = users.sort((a, b) => {
      if (a.lastName && b.lastName) {
        if (a.lastName < b.lastName) {
          return -1;
        }
        if (a.lastName > b.lastName) {
          return 1;
        }
      }

      return 0;
    });

    const data = usersSortedByLastName.map((user, index) => {
      return {
        rowId: String(index + 1),
        id: user.id,
        cellData: {
          sequence: String(index + 1),
          first: user.firstName,
          last: user.lastName,
          mail: ['gp-icon-mail', user.email],
          status: user.enabled
            ? ['is-category', 'Active', 50] // this will generate the custom tag
            : ['is-category', 'Inactive', 50],
        },
      };
    });

    this.dynamicRowData = data as ITableRow[];
  }

  onFilterChange(event: IFilterChange): void {
    // if all filters are false, remove the filter
    //TODO: We actually need to implement filtering.
    if (Object.values(event.filters).every((value) => !value)) {
      this.filters.delete(event.columnMetadatum.dataKey);
    }
    this.filters.set(event.columnMetadatum.dataKey, event.filters);
  }

  private refreshTableData() {
    this.generateUserRowData();
    this.dataGenerator.update();
  }

  private getSortedData(
    sortColumnDataKey: string,
    sortDirectionCoefficient: number
  ) {
    return this.dynamicRowData.sort((a, b) => {
      if (a.cellData[sortColumnDataKey] < b.cellData[sortColumnDataKey]) {
        return -1 * sortDirectionCoefficient;
      }
      if (a.cellData[sortColumnDataKey] > b.cellData[sortColumnDataKey]) {
        return 1 * sortDirectionCoefficient;
      }
      return 0;
    });
  }

  private getSortDirectionCoefficient(
    columnDisplayMetadata: TableColumnDisplayMetadatum[]
  ): { sortColumnDataKey: string; sortDirectionCoefficient: number } {
    let sortColumnDataKey = '';

    for (let i = 0; i < columnDisplayMetadata.length; i++) {
      if (
        columnDisplayMetadata[i].sort &&
        columnDisplayMetadata[i].sort !== TableColumnSortStateEnum.None
      ) {
        sortColumnDataKey = columnDisplayMetadata[i].dataKey;
        if (
          columnDisplayMetadata[i].sort === TableColumnSortStateEnum.Ascending
        ) {
          return { sortColumnDataKey, sortDirectionCoefficient: 1 };
        }
        if (
          columnDisplayMetadata[i].sort === TableColumnSortStateEnum.Descending
        ) {
          return { sortColumnDataKey, sortDirectionCoefficient: -1 };
        }
        break;
      }
    }
    return { sortColumnDataKey, sortDirectionCoefficient: 0 };
  }
}
