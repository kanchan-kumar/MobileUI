/* Class defines the column of table grid used with prime ng table. */
export class TabularDataColumns {
    field: string = null;
    sortField: string = null;
    header: string = null;
    footer: string = null;
    sortable: any = false;
    sortFunction: Function = null;
    editable: boolean = false;
    filter: boolean = false;
    filterMatchMode: string = 'contains';
    filterPlaceholder: string = null;
    rowspan: string = null;
    colspan: string = null;
    style: any = null;
    styleClass: string = null;
    tableStyle: string = null;
    tableStyleClass: string = null;
    hidden: boolean = false;
    expander: boolean = false;
    selectionMode: string = null;
    frozen: boolean = false;
    colClass: string = null;
    index: number = -1;
    headerCellTooltip: string = '';
    type: string;
}