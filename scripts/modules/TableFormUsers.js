import DB from "../db.js";
import Session from "../session.js"
import BaseTableForm from "./base/BaseTableForm.js";
import FloatingMessage from "./FloatingMessage.js";

function TableFormUsers({ formMode, rowId, tableObject } = {}) {
    this.super({
        formMode,
        rowId,
        tableObject,
        condition: [ "user_id" ],
        upperFields: [ "user_id" ],
        uncheckFields: [ "password", "exit-date" ]
    });
    this.regExp = {};
    
    this.ini();
}

TableFormUsers.prototype = new BaseTableForm();
TableFormUsers.prototype.constructor = TableFormUsers;
TableFormUsers.prototype.super = BaseTableForm;

TableFormUsers.prototype.ini = function() {
    this.regExp = {
        user_id: value => /^[a-zA-Z]?\d+$/.test(value),
        name: value => /^[a-zA-Z\sáéíóúñÁÉÍÓÚÑ]+$/.test(value),
        surname: value => /^[a-zA-Z\sáéíóúñÁÉÍÓÚÑ]+$/.test(value),
        phone_number: value => /^\+?\d+$/.test(value),
        email: value => /^[a-zA-Z\d](?:(?:\.|_)?[a-zA-Z\d]+)*@[a-zA-Z\d]+\.[a-zA-Z]+$/.test(value),
        sex: value => /^\d+$/.test(value),
        position: value => /^\d+$/.test(value),
        entry_date: value => /^\d{4}\-\d{1,2}\-\d{1,2}$/.test(value),
        exit_date: value => /^\d{4}\-\d{1,2}\-\d{1,2}$/.test(value),
        password: value => /^[a-zA-Z\d\,\;\.\:\-\_\!\#\$\%\&\(\)\/\=\¡\?\¿\[\]\{\}\+\*]+$/.test(value)
    }
}
TableFormUsers.prototype.send = function() {
    const dataElements = [ ...this.entries.inputs, ...this.entries.selects ];
    
    if (!this.checkData(dataElements))
        return false;

    if (this.formMode == "edit") {
        const data = this.compoundedData()
        const dataForTable = { table: this.table.DBTable, condition: this.rowIdCondition, data };
        const dataForAccess = { table: "user_access", condition: { user_id: this.rowIdCondition.user_id }, data: { user_id: data.user_id } }
        const differentPrimaryKey = Object.entries(this.rowIdCondition).map(([key, value]) => data[key] != value).some(i => i);
        let result1 = null, result2 = true;
        
        // Validamos si se busca cambiar el primary key
        if (differentPrimaryKey) {
            // Validamos que no exista un primary key igual
            const condition = {};
            let index = null;
            
            Object.keys(this.rowIdCondition).forEach(cond => condition[cond] = data[cond]);
            index = DB.get({ table: this.table.DBTable, condition });
            
            if (index != null) {
                FloatingMessage.say("No fue posible editar el registro", "error");
                return;
            }
        }

        result1 = DB.post(dataForTable);
        if (result1) {
            if (differentPrimaryKey)
                result2 = DB.post(dataForAccess)
            if (result2) {
                this.table.contentManager.update();
                this.table.pagination.update();

                FloatingMessage.say("Registro editado satisfactoriamente", "success");
                this.close();

                // Verificamos si el usuario al que se cambio su cédula es el mismo adminsitrador logeado
                if (differentPrimaryKey && Session.get("logged").user_id == this.rowIdCondition.user_id)
                    window.location = "logout.html";

                return;
            }
        }

        FloatingMessage.say("No fue posible editar el registro", "error");
    } else if (this.formMode == "create") {
        const date = new Date();
        const employeeData = this.compoundedData();
        const data = this.compoundedData();
        let result1 = null, result2 = null;

        delete employeeData.password;

        result1 = DB.put({ table: this.table.DBTable, data: employeeData });
        if (result1) {
            result2 = DB.put({
                table: "user_access",
                data: {
                    user_id: data.user_id,
                    password: data.password,
                    creation_date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                }
            });
            if (result2) {
                this.table.contentManager.update();
                this.table.pagination.update();
                FloatingMessage.say("Registro creado satisfactoriamente", "success");
                this.close();
                return;
            }
            
            DB.delete({ table: this.table.DBTable, condition: { user_id: data.user_id } })
        }

        FloatingMessage.say("No se creó el registro", "error");
    }
}

export default TableFormUsers;