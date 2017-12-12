import { TabularDataColumns } from './tabular-data-columns';

export class TabularData {
  tableData: any = [];
  tableColumns: TabularDataColumns[] = null;
  isCheckSelectionReq: boolean = true;
  arrFilterCols: any = [];
  selectedPanel: number = 0;
  selectedWidget: number = 0;
  tabularDataMode: number = 0;
  tableSelectedRows: number[] = [];
  allRowsSelected: boolean = true;
  visibleRowPerPage: number = 5;
  visiblePageLinks: number = 3;
  rowsPerPageOptions: number[] = [3, 5, 10, 20, 50];
}
