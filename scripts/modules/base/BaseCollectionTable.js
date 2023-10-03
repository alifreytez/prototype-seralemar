import DB from "../../db.js";
import Session from "../../session.js"
import EventAssign from "../EventAssign.js";
import AdvancedSelect from "../AdvancedSelect.js";
import TablePagination from "../TablePagination.js";

function BaseCollectionTable({ tableHtml, formHtml, tableComponent, formComponent } = {}) {
    this.contentElement = document.getElementById("content");
    this.managementFormElement = document.getElementById("management-form");
    this.element = null;
    this.tableHtml = "";
    this.formHtml = "";
    this.DBTable = "collection_tables";
    this.filters = {}
    this.managementForm = null;
    this.contentManager = null;
    this.pagination = null;
    this.tableComponent = null;
    this.formComponent = null;
    
    this.start({ tableHtml, formHtml, tableComponent, formComponent });
}

BaseCollectionTable.prototype.start = function({ tableHtml, formHtml, tableComponent, formComponent }) {
    if (tableHtml == null)
        return;

    this.tableHtml = tableHtml;
    this.formHtml = formHtml;
    this.render();

    this.element = document.getElementById("collection-table");
    this.tableComponent = tableComponent;
    this.formComponent = formComponent;
    document.querySelectorAll("#content-header-form input, #content-header-form select").forEach(ele => {
        this.filters[ele.name.replaceAll(/\-/g, "_")] = ele;
    });
    document.querySelectorAll("select").forEach((element) => {
        // Llenado de datos de los select en base a DB.
        const selectName = element.name.replace("filter-", "").replaceAll("-", "_");
        if (Object.keys(DB.get({ table: "relations" })).includes(selectName)) {
            const options = [
                element.name.includes("filter") ? `<option value="none">Sin especificar</option>` : "",
                ...DB.get({ table: "relations" })[selectName].map((string, index) => `<option value="${index}">${string}</option>`)
            ];
            element.innerHTML = options.join("");
        } else if (selectName == "client_rif") {
            const options = [
                element.name.includes("filter") ? `<option value="none">Sin especificar</option>` : "",
                ...DB.get({ table: "clients" }).map(({ client_rif }) => `<option value="${client_rif}">${client_rif}</option>`)
            ];
            element.innerHTML = options.join("");
        } else if (selectName == "user_id") {
            const options = [
                element.name.includes("filter") ? `<option value="none">Sin especificar</option>` : "",
                ...DB.get({ table: "employees", condition: { position: 1 }, all: true }).map(({ user_id }) => `<option value="${user_id}">${user_id}</option>`)
            ];
            element.innerHTML = options.join("");
        }

        Session.local.advancedSelects[element.getAttribute("name").replaceAll("-", "_")] = new AdvancedSelect({
            objectId: element.dataset.objectId,
            elementName: element.getAttribute("name")
        });
    });
    this.startEvents();
    this.contentManager = new tableComponent({ tableObject: this, formComponent });
    this.pagination = new TablePagination(this);
}
BaseCollectionTable.prototype.startEvents = function() {
    EventAssign.add({
        eventType: "click",
        callback: {
            name: "BCT_deleteAllRows",
            func: (event) => {
                if (!event.target.matches("#delete-all-rows, #delete-all-rows > *"))
                    return;

                this.deleteRows([ ...this.element.querySelectorAll(`.btn-select-row[data-selected="1"]`) ]);
            }
        }
    });
    EventAssign.add({
        eventType: "click",
        callback: {
            name: "BCT_createRow",
            func: (event) => {
                if (!event.target.matches("#create-row, #create-row > *"))
                    return;

                this.managementForm = new this.formComponent({ formMode: "create", tableObject: this });
                this.managementForm.open();
            }
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
BaseCollectionTable.prototype.deleteRows = function(elements) {
    const findRowId = (target) => { 
        let parent = target;
        do parent = parent.parentElement; while (parent.tagName != "TR")
        return parent.dataset.rowId;
    };
    
    if (!elements.length || !confirm("Procederá a eliminar registros, ¿está seguro?"))
        return;

    elements.forEach(ele => {
        const [ invoice_number ] = findRowId(ele).split("+");
        DB.delete({ table: this.DBTable, condition: { invoice_number } });
    });
    
    this.contentManager.update();
    this.pagination.update();
}
BaseCollectionTable.prototype.render = function() {
    this.contentElement.innerHTML = this.tableHtml;
    this.managementFormElement.innerHTML = this.formHtml;
}

export default BaseCollectionTable;