export class DashboardMenuDef {
    label: string = null;
    icon: string = null;
    items: DashboardMenuDef[] = null;
    command?: (event?: any) => void;
    data: any = null;
    selectedHierarchy: string = null;
    separator: boolean = false;

    constructor(name: string, icon: string, arrSubMenu: DashboardMenuDef[], onMenuClick) {
        this.label = name;
        this.icon = icon;
        this.items = arrSubMenu;

        /* Event for Only Leaf Nodes.*/
        if (onMenuClick !== null) {
            this.command = (event) => onMenuClick(event);
        }
    }

    commandEvt(onMenuClick) {
        this.command = (event) => onMenuClick(event);
    }

    public get isSeparator(): boolean {
        return this.separator;
    }

    public set setSeparator(separator: boolean) {
        this.separator = separator;
    }

    get menuName(): string {
        return this.label;
    }

    set menuName(name: string) {
        this.label = name;
    }

    set iconName(icon: string) {
        this.icon = icon;
    }

    get iconName(): string {
        return this.icon;
    }

    set setSubMenuArr(arrSubMenu: DashboardMenuDef[]) {
        this.items = arrSubMenu;
    }

    get getSubMenuArr(): DashboardMenuDef[] {
        return this.items;
    }

    set menuData(data: string) {
        this.data = data;
    }

    public get $selectedHierarchy(): string {
        return this.selectedHierarchy;
    }

    public set $selectedHierarchy(value: string) {
        this.selectedHierarchy = value;
    }

}