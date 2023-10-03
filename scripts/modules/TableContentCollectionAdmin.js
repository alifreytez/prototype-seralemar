import DB from "../db.js";
import Config from "../config.js"
import Session from "../session.js"
import BaseTableContent from "./base/BaseTableContent.js";

function TableContentCollectionAdmin({ tableObject, formComponent } = {}) {
    this.super({ tableObject, formComponent });
}

TableContentCollectionAdmin.prototype = new BaseTableContent();
TableContentCollectionAdmin.prototype.constructor = TableContentCollectionAdmin;
TableContentCollectionAdmin.prototype.super = BaseTableContent;

TableContentCollectionAdmin.prototype.ini = function() {}
TableContentCollectionAdmin.prototype.prepareData = function() {
    const filters = {};
    let data = DB.get({ table: this.table.DBTable });
    
    /* Filtering */
    Object.entries(this.table.filters).forEach(([key, value]) => filters[key] = value.value);
    // Nivel 1: Vendedor
    if (filters.filter_user_id != "") {
        data = data.filter(row => {
            return new RegExp(filters.filter_user_id, "i").test(row.user_id);
        })
    }
    // Nivel 2: Fecha de creación
    if (filters.filter_creation_date != "none") {
        data = data.filter(row => {
            const mes = parseInt(row.creation_date.replace(/^\d+\-(\d+)\-\d+$/, "$1")) - 1;
            return mes == filters.filter_creation_date;
        });
    }
    // Nivel 3: Tipo de pago | Estado
    if (filters.filter_payment_type != "none")
        data = data.filter(row => row.payment_type == filters.filter_payment_type);
    if (filters.filter_debt_status != "none")
        data = data.filter(row => row.debt_status == filters.filter_debt_status);
    // Nivel 4: Palabra clave
    if (filters.filter_keyword != "") {
        data = data.filter(row => {
            const full_data_row = {
                ...row,
                payment_type: DB.interpolate({ type: "payment_type", value: row.payment_type }),
                debt_status: DB.interpolate({ type: "debt_status", value: row.debt_status })
            };
            return Object.values(full_data_row).some(string => new RegExp(filters.filter_keyword, "i").test(string));
        })
    }

    this.data = data;
}
TableContentCollectionAdmin.prototype.fillTable = function(page = 1) {
    if (isNaN(page))
        return;

    let tbody = "";
    const rowPageIndex = Config.rows_number * (page - 1);

    /* Filling */

    this.data.slice(rowPageIndex, rowPageIndex + Config.rows_number).forEach(row => {
        const full_data_row = {
            ...row,
            payment_type: DB.interpolate({ type: "payment_type", value: row.payment_type }),
            debt_status: DB.interpolate({ type: "debt_status", value: row.debt_status })
        };
        
        tbody += `
            <tr data-row-id="${full_data_row.invoice_number}">
                <td><button type="button" class="btn-select-row" data-selected="0"><i class="fa-regular fa-square"></i></button></td>
                <td>${full_data_row.invoice_number}</td>
                ${Session.loginInfo().position == 0 ? `<td>${full_data_row.user_id}</td>` : ""}                
                <td>${full_data_row.client_rif}</td>
                <td>${full_data_row.dollar_amount}</td>
                <td>${full_data_row.bolivar_amount}</td>
                <td>${full_data_row.remaining_debt}</td>
                <td>${full_data_row.exchange_rate}</td>
                <td>${full_data_row.payment_type}</td>
                <td>${full_data_row.debt_status}</td>
                <td>${full_data_row.expiration_date}</td>
                <td class="options">
                    <button type="button" class="btn-edit-row"><i class="fa-solid fa-pen-to-square"></i></button>
                    ${Session.loginInfo().position == 0 ? `<button type="button" class="btn-delete-row"><i class="fa-solid fa-trash"></i></button>` : ""} 
                </td>
            </tr>
        `;
    });

    this.element.innerHTML = tbody;
}

export default TableContentCollectionAdmin;