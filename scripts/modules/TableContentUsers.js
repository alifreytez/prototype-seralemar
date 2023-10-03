import DB from "../db.js";
import Config from "../config.js"
import BaseTableContent from "./base/BaseTableContent.js";

function TableContentUsers({ tableObject, formComponent }) {
    this.super({ tableObject, formComponent });

    this.ini();
}

TableContentUsers.prototype = new BaseTableContent();
TableContentUsers.prototype.constructor = TableContentUsers;
TableContentUsers.prototype.super = BaseTableContent;

TableContentUsers.prototype.ini = function() {}
TableContentUsers.prototype.prepareData = function() {
    const filters = {};
    let data = DB.get({ table: this.table.DBTable });
    
    /* Filtering */
    Object.entries(this.table.filters).forEach(([key, value]) => filters[key] = value.value);
    // Nivel 1: Tipo de pago | Estado
    if (filters.filter_sex != "none")
        data = data.filter(row => row.sex == filters.filter_sex);
    if (filters.filter_position != "none")
        data = data.filter(row => row.position == filters.filter_position);
    // Nivel 2: Palabra clave
    if (filters.filter_keyword != "") {
        data = data.filter(row => {
            const full_data_row = {
                ...row,
                position: DB.get({ table: "positions", condition: { id: row.position } }).position_name,
                sex: DB.interpolate({ type: "sex", value: row.sex })
            };
            return Object.values(full_data_row).some(string => new RegExp(filters.filter_keyword, "i").test(string));
        })
    }

    this.data = data;
}
TableContentUsers.prototype.fillTable = function(page = 1) {
    if (isNaN(page))
        return;

    let tbody = "";
    const rowPageIndex = Config.rows_number * (page - 1);

    /* Filling */

    this.data.slice(rowPageIndex, rowPageIndex + Config.rows_number).forEach(row => {
        const full_data_row = {
            ...row,
            position: DB.get({ table: "positions", condition: { id: row.position } }).position_name,
            sex: DB.interpolate({ type: "sex", value: row.sex })
        };
        
        tbody += `
            <tr data-row-id="${full_data_row.user_id}">
                <td><button type="button" class="btn-select-row" data-selected="0"><i class="fa-regular fa-square"></i></button></td>
                <td>${full_data_row.name}</td>
                <td>${full_data_row.surname}</td>
                <td>${full_data_row.user_id}</td>
                <td>${full_data_row.phone_number}</td>
                <td>${full_data_row.email}</td>
                <td>${full_data_row.sex}</td>
                <td>${full_data_row.position}</td>
                <td>${full_data_row.entry_date}</td>
                <td>${full_data_row.exit_date}</td>
                <td class="options">
                    <button type="button" class="btn-edit-row"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button type="button" class="btn-delete-row"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });

    this.table.element.querySelector("tbody").innerHTML = tbody;
}

export default TableContentUsers;
