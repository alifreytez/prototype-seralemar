import DB from "../db.js";
import BaseTableForm from "./base/BaseTableForm.js";
import FloatingMessage from "./FloatingMessage.js";

function TableFormCollectionSeller({ formMode, rowId, tableObject } = {}) {
    this.super({
        formMode,
        rowId,
        tableObject,
        condition: [ "invoice_number" ],
        upperFields: [ "user_id", "invoice_number", "client_rif" ],
        uncheckFields: [ ]
    });
    
    this.ini();
}

TableFormCollectionSeller.prototype = new BaseTableForm();
TableFormCollectionSeller.prototype.constructor = TableFormCollectionSeller;
TableFormCollectionSeller.prototype.super = BaseTableForm;

TableFormCollectionSeller.prototype.ini = function() {
    this.regExp = {
        user_id: value => /^[a-zA-Z]?\d+$/.test(value),
        invoice_number: value => /^[a-zA-Z]+\d+$/.test(value),
        client_rif: value => /^[a-zA-Z]\-\d+$/.test(value),
        exchange_rate: value => /^\d+(?:(?:\.|\,)\d+)?$/.test(value),
        dollar_amount: value => /^\d+(?:(?:\.|\,)\d+)?$/.test(value),
        bolivar_amount: value => /^\d+(?:(?:\.|\,)\d+)?$/.test(value),
        remaining_debt: value => /^\d+(?:(?:\.|\,)\d+)?$/.test(value),
        exchange_rate: value => /^\d+(?:(?:\.|\,)\d+)?$/.test(value),
        payment_type: value => /^\d{1}$/.test(value),
        debt_status: value => /^\d{1}$/.test(value),
        observation: value => /^[\w\s\?\!\(\)\=\&\%\$\#\"\'áéíóúÁÉÍÓÚñ\/\*\-\_\+\,\;\.\:\{\}\[\]]*$/.test(value),
        creation_date: value => /^\d{4}\-\d{1,2}\-\d{1,2}$/.test(value),
        expiration_date: value => /^\d{4}\-\d{1,2}\-\d{1,2}$/.test(value),
    }
}
TableFormCollectionSeller.prototype.send = function() {
    const dataElements = [ ...this.entries.inputs, ...this.entries.selects ];

    if (!this.checkData(dataElements))
        return false;

    const data = this.compoundedData();
    const dataInDb = DB.get({ table: this.table.DBTable, condition: this.rowIdCondition });
    const hadChanges = Object.entries(data).some(([key, value]) => dataInDb[key] != value);
    
    if (hadChanges) {
        // Verificamos que no exista un registro con el mismo invoice_number en estado pendiente.
        const inDB = DB.get({ table: "collection_tables_changes", condition: { ...this.rowIdCondition, change_status: 1 } });
        if (inDB != undefined) {
            // Actualizamos
            const result = DB.post({
                table: "collection_tables_changes",
                data,
                condition: { ...this.rowIdCondition, change_status: 1 }
            });
            if (result) {
                this.table.contentManager.update();
                this.table.pagination.update();
    
                FloatingMessage.say("Solicitud guardada satisfactoriamente", "success");
                this.close();
                return;
            }

            return;
        }

        // Preparamos la data
        Object.entries(data).forEach(([key, value]) => dataInDb[key] = value);
        const id = DB.get({ table: "collection_tables_changes" }).reduce((acc, cur) => {
            return parseInt(cur.id) > acc ? parseInt(cur.id) : acc;
        }, 0) + 1;
        let request_date = new Date();
        // Insertamos
        const result = DB.put({
            table: "collection_tables_changes",
            data: {
                id,
                request_date: `${request_date.getFullYear()}-${request_date.getMonth() + 1}-${request_date.getDate()}`,
                change_status: 1,
                ...dataInDb
            }
        });
        if (result) {
            this.table.contentManager.update();
            this.table.pagination.update();

            FloatingMessage.say("Solicitud guardada satisfactoriamente", "success");
            this.close();
            return;
        }
    }
    
    FloatingMessage.say("No fue posible guardar la solicitud", "error");
}

export default TableFormCollectionSeller;