import DB from "../db.js";
import EventAssign from "./EventAssign.js";
import TableContentUsers from "./TableContentUsers.js";
import TableFormUsers from "./TableFormUsers.js";
import TablePagination from "./TablePagination.js";

function UsersTable() {
    this.element = document.getElementById("users-table");
    this.DBTable = "employees";
    this.filters = {}
    this.managementForm = null;
    this.contentManager = null;
    this.pagination = null;
    
    this.ini();
}

UsersTable.prototype.ini = function() {
    document.querySelectorAll("#content-header-form input, #content-header-form select").forEach(ele => {
        this.filters[ele.name.replaceAll(/\-/g, "_")] = ele;
    });
    this.assignEvents();
    this.contentManager = new TableContentUsers({ tableObject: this, formComponent: TableFormUsers });
    this.pagination = new TablePagination(this);
}
UsersTable.prototype.assignEvents = function() {
    EventAssign.add({
        eventType: "click",
        target: "#delete-all-rows, #delete-all-rows > *",
        callback: (event) => {
            this.deleteRows([ ...this.element.querySelectorAll(`.btn-select-row[data-selected="1"]`) ]);
        }
    });
    EventAssign.add({
        eventType: "click",
        target: "#create-row, #create-row > *",
        callback: (event) => {
            this.managementForm = new TableFormUsers({ formMode: "create", tableObject: this });
            this.managementForm.open();
        }
    });

    Object.values(this.filters).forEach(ele => {
        if (ele.tagName.toLowerCase() == "input") {
            EventAssign.add({
                eventType: "keypress",
                origin: ele,
                callback: (event) => {
                    if (event.key !== "Enter")
                        return;
                    
                    this.contentManager.update();
                    this.pagination.update();
                }
            });
            return;
        }
        EventAssign.add({
            eventType: "change",
            origin: ele,
            callback: (event) => {
                this.contentManager.update();
                this.pagination.update();
            }
        });
    });
}
UsersTable.prototype.deleteRows = function(elements) {
    const findRowId = (target) => { 
        let parent = target;
        do parent = parent.parentElement; while (parent.tagName != "TR")
        return parent.dataset.rowId;
    };
    
    if (!elements.length || !confirm("Procederá a eliminar registros, ¿está seguro?"))
        return;

    elements.forEach(ele => {
        const [ user_id  ] = findRowId(ele).split("+");
        const condition = { user_id };
        DB.delete({ table: this.DBTable, condition });
        DB.delete({ table: "user_access", condition });
    });
    
    this.contentManager.update();
    this.pagination.update();
}

export default UsersTable;