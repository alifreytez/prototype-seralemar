import DB from "../db.js";
import BaseTableForm from "./base/BaseTableForm.js";
import FloatingMessage from "./FloatingMessage.js";

function TableFormCollectionAdmin({ formMode, rowId, tableObject } = {}) {
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

TableFormCollectionAdmin.prototype = new BaseTableForm();
TableFormCollectionAdmin.prototype.constructor = TableFormCollectionAdmin;
TableFormCollectionAdmin.prototype.super = BaseTableForm;

TableFormCollectionAdmin.prototype.ini = function() {
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
TableFormCollectionAdmin.prototype.send = function() {
    const dataElements = [ ...this.entries.inputs, ...this.entries.selects ];

    if (!this.checkData(dataElements))
        return false;

    if (this.formMode == "edit") {
        const data = this.compoundedData()
        const dataForTable = { table: this.table.DBTable, condition: this.rowIdCondition, data };
        const differentPrimaryKey = Object.entries(this.rowIdCondition).map(([key, value]) => data[key] != value).some(i => i);
        let result = null;

        // Validamos si se busca cambiar el primary key
        if (differentPrimaryKey) {
            // Validamos que no exista un primary key igual
            const condition = {};
            let index = null;
            
            Object.keys(this.rowIdCondition).forEach(cond => condition[cond] = data[cond]);
            index = DB.getIndex({ table: this.table.DBTable, condition });
            
            if (index !== -1) {
                FloatingMessage.say("No fue posible editar el registro", "error");
                return;
            }
        }

        result = DB.post(dataForTable);
        if (result) {
            this.table.contentManager.update();
            this.table.pagination.update();

            FloatingMessage.say("Registro editado satisfactoriamente", "success");
            this.close();
            
            return;
        }

        FloatingMessage.say("No fue posible editar el registro", "error");
    } else if (this.formMode == "create") {
        const date = new Date();
        const result = DB.put({
            table: this.table.DBTable,
            data: { ...this.compoundedData(), creation_date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` }
        });

        if (!result) {
            FloatingMessage.say("No pudo crearse el registro", "error");
            return;
        }

        this.table.contentManager.update();
        this.table.pagination.update();
        FloatingMessage.say("Registro creado satisfactoriamente", "success");
        this.close();
    }
}

export default TableFormCollectionAdmin;