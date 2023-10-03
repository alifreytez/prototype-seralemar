import DB from "../db.js";
import Config from "../config.js"
import Session from "../session.js"
import EventAssign from "./EventAssign.js";
import AdvancedSelect from "./AdvancedSelect.js";
import BaseTableContent from "./base/BaseTableContent.js";
import TablePagination from "./TablePagination.js";

function TableContentReminder({ tableObject, formComponent } = {}) {
    this.super({ tableObject, formComponent });
    this.elementWrapper = null;
    this.pagination = null;

    this.ini();
}

TableContentReminder.prototype = new BaseTableContent();
TableContentReminder.prototype.constructor = TableContentReminder;
TableContentReminder.prototype.super = BaseTableContent;

TableContentReminder.prototype.ini = function() {
    this.elementWrapper = document.getElementById("reminder-list");
    this.elementWrapper.querySelectorAll("select").forEach((select) => {
        const selectName = select.name.replace("filter-", "").replaceAll("-", "_");
        // Llenado de datos de los select en base a DB.
        if (Object.keys(DB.get({ table: "relations" })).includes(selectName)) {
            const options = [
                select.name.includes("filter") ? `<option value="none">Sin especificar</option>` : "",
                ...DB.get({ table: "relations" })[selectName].map((string, index) => `<option value="${index}">${string}</option>`)
            ];
            select.innerHTML = options.join("");
        }
        Session.local.advancedSelects[select.getAttribute("name").replaceAll("-", "_")] = new AdvancedSelect({
            objectId: select.dataset.objectId,
            elementName: select.getAttribute("name")
        });
    });
    this.pagination = new TablePagination(this);
    this.clear();
    this.assignEvents();
}
TableContentReminder.prototype.clear = function() {
    Object.values(this.table.filters).forEach(ele => {
        if (ele.tagName == "SELECT") {
            if (Object.keys(Session.local.advancedSelects).length) {
                const advancedObject = Session.local.advancedSelects[ele.getAttribute("name").replaceAll("-", "_")];
                const [ key, value ] = Object.entries(advancedObject.options)[0];
                advancedObject.selectOption(advancedObject.getOption(key).option);
            }
        }
        else
            ele.value = "";
        ele.classList.remove("wrong");
    });
    this.update();
    this.pagination.update();
}
TableContentReminder.prototype.assignEvents = function() {
    EventAssign.add({
        eventType: "click",
		callback: {
            name: "BTC_close",
            func: (event) => {
                if (!event.target.matches("#close-list, #close-list > *"))
                    return;
                
                this.close();
            }
        }
    });
    EventAssign.add({
        eventType: "submit",
        origin: document.getElementById("content-header-form"),
        callback: {
            name: "BTC_filterSubmit",
            func: (event) => {
                event.preventDefault();
            }
        }
    });
    EventAssign.add({
        eventType: "click",
        callback: {
            name: "BTC_deleteAllRows",
            func: (event) => {
                if (!event.target.matches("#delete-all-rows, #delete-all-rows > *"))
                return;
            
                this.table.deleteRows([ ...this.element.querySelectorAll(`.btn-select-row[data-selected="1"]`) ]);
            }
        }
    });
    if (Object.keys(this.table.filters).length) {
        Object.values(this.table.filters).forEach((ele, index) => {
            if (ele.tagName.toLowerCase() == "input") {
                EventAssign.add({
                    eventType: "keypress",
                    origin: ele,
                    callback: {
                        name: "BTC_filterInputSubmit"+index,
                        func: (event) => {
                            if (event.key !== "Enter")
                                return;
                            
                            this.update();
                            //this.pagination.update();
                        }
                    }
                });
                return;
            }
            EventAssign.add({
                eventType: "change",
                origin: ele,
                callback: {
                    name: "BTC_filterInputChange"+index,
                    func: (event) => {
                        this.update();
                        //this.pagination.update();
                    }
                }
            });
        });
    }
}
TableContentReminder.prototype.prepareData = function() {
    const filters = {};
    let data = DB.get({ table: "reminders" });
    
    /* Filtering */
    Object.entries(this.table.filters).forEach(([key, value]) => filters[key] = value.value);
    // Nivel 1: Palabra clave
    if (filters.filter_keyword != "") {
        data = data.filter(row => {
            return Object.values(row).some(string => new RegExp(filters.filter_keyword, "i").test(string));
        })
    }
    // Nivel 2: Fecha de creación
    if (filters.filter_execute_date != "none") {
        data = data.filter(row => {
            const month = parseInt(row.execute_date.replace(/^\d+\-(\d+)\-\d+$/, "$1")) - 1;
            return month == filters.filter_execute_date;
        });
    }

    this.data = data;
}
TableContentReminder.prototype.open = function() {
    return new Promise((resolve) => {
        this.elementWrapper.classList.add("display");
        setTimeout(() => {
            this.elementWrapper.classList.add("show");
            resolve();
        }, 10);
    });
}
TableContentReminder.prototype.close = function() {
    return new Promise((resolve) => {
        this.elementWrapper.classList.remove("show");
        setTimeout(() => {
            this.elementWrapper.classList.remove("display")
            resolve();
        }, Config.nav_time);
    });
}
TableContentReminder.prototype.fillTable = function(page = 1) {
    if (isNaN(page))
        return;

    let tbody = "";
    const rowPageIndex = Config.rows_number * (page - 1);

    /* Filling */

    this.data.slice(rowPageIndex, rowPageIndex + Config.rows_number).forEach(row => {    
        tbody += `
            <tr data-row-id="${row.id}">
                <td><button type="button" class="btn-select-row" data-selected="0"><i class="fa-regular fa-square"></i></button></td>
                <td>${row.by_user_id}</td>
                <td>${row.to_user_id}</td>
                <td>${row.message}</td>
                <td>${row.execute_date}</td>
                <td class="options">
                    <button type="button" class="btn-delete-row"><i class="fa-solid fa-trash"></i></button> 
                </td>
            </tr>
        `;
    });

    this.element.innerHTML = tbody;
}

export default TableContentReminder;