import DB from "../db.js";
import Config from "../config.js"
import BaseTableContent from "./base/BaseTableContent.js";

function TableContentClients({ tableObject, formComponent } = {}) {
    this.super({ tableObject, formComponent });
    
    this.ini();
}

TableContentClients.prototype = new BaseTableContent();
TableContentClients.prototype.constructor = TableContentClients;
TableContentClients.prototype.super = BaseTableContent;

TableContentClients.prototype.ini = function() {}
TableContentClients.prototype.prepareData = function() {
    const filters = {};
    let data = DB.get({ table: this.table.DBTable });
    
    /* Filtering */
    Object.entries(this.table.filters).forEach(([key, value]) => filters[key] = value.value);
    // Nivel 1: Tipo de pago | Estado
    if (filters.filter_state != "none")
        data = data.filter(row => row.state == filters.filter_state);
    // Nivel 2: Palabra clave
    if (filters.filter_keyword != "") {
        data = data.filter(row => {
            const full_data_row = {
                ...row,
                state: DB.get({ table: "states", condition: { id: row.state } }).state_name,
            };
            return Object.values(full_data_row).some(string => new RegExp(filters.filter_keyword, "i").test(string));
        })
    }
    

    this.data = data;
}
TableContentClients.prototype.fillTable = function(page = 1) {
    if (isNaN(page))
        return;

    let tbody = "";
    const rowPageIndex = Config.rows_number * (page - 1);

    /* Filling */

    this.data.slice(rowPageIndex, rowPageIndex + Config.rows_number).forEach(row => {
        const full_data_row = {
            ...row,
            state_name: DB.get({ table: "states", condition: { id: row.state } }).state_name,
        };
        
        tbody += `
            <tr data-row-id="${full_data_row.client_rif}">
                <td><button type="button" class="btn-select-row" data-selected="0"><i class="fa-regular fa-square"></i></button></td>
                <td>${full_data_row.client_rif}</td>
                <td>${full_data_row.client_name}</td>
                <td>${full_data_row.state_name}</td>
                <td class="options">
                    <button type="button" class="btn-edit-row"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button type="button" class="btn-delete-row"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });

    this.table.element.querySelector("tbody").innerHTML = tbody;
}

export default TableContentClients;
