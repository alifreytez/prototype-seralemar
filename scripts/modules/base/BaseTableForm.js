import DB from "../../db.js";
import Config from "../../config.js";
import Session from "../../session.js"
import EventAssign from "../EventAssign.js";

function BaseTableForm({ formMode, rowId, tableObject, condition, upperFields = [], uncheckFields } = {}) {
    this.element = document.getElementById(Config.management_form_id);
    this.formMode = formMode;
    this.rowId = rowId;
    this.rowIdCondition = {}
    this.table = null;
    this.entries = { inputs: [], selects: [], textareas: [] };
    this.upperFields = [];
    this.uncheckFields = [];

    this.start(tableObject, condition, upperFields, uncheckFields);
}

BaseTableForm.prototype = Object.create(null);
BaseTableForm.constructor = BaseTableForm;

BaseTableForm.prototype.start = function(tableObject, condition, upperFields, uncheckFields) {
    if (tableObject == null)
        return;

    if (this.rowId != null) {
        let splitedRowId = this.rowId.split("+");
        condition.forEach((key, index) => this.rowIdCondition[key] = splitedRowId[index]);
    }
    this.table = tableObject;
    this.upperFields = upperFields;
    this.uncheckFields = uncheckFields;
    this.element.querySelectorAll("input").forEach(ele => this.entries.inputs.push(ele));
    this.element.querySelectorAll("select").forEach(ele => this.entries.selects.push(ele));
    this.element.querySelectorAll("textarea").forEach(ele => this.entries.textareas.push(ele));
    this.clearForm();
    if (this.formMode == "edit")
        this.fillForm();
    
    this.startEvents();
    this.updateTitle();
}
BaseTableForm.prototype.startEvents = function() {
    EventAssign.list.clean({ family: "BTF", match: true });
    EventAssign.add({
        eventType: "click",
		callback: {
            name: "BTF_closeForm",
            func: (event) => {
                if (event.target.matches("#close-form, #close-form > *"))
                    this.close();
            }
        }
    });
    EventAssign.add({
        eventType: "submit",
        origin: this.element,
		callback: {
            name: "BTF_submitForm",
            func: (event) => {
                event.preventDefault()
            }
        }
    });
    EventAssign.add({
        eventType: "click",
		callback: {
            name: "BTF_sendForm",
            func: (event) => {
                if (event.target.matches("#submit-form, #submit-form *"))
                    this.send();
            }
        }
    });
    if (this.entries.inputs.length) {
        this.entries.inputs.forEach((ele, index) => {
            EventAssign.add({
                origin: ele,
                eventType: "input",
                callback: {
                    name: `BTF_checkDataInput${index}`,
                    func: (event) => {
                        this.checkData([ ele ]);
                    }
                }
            });
            EventAssign.add({
                origin: ele,
                eventType: "blur",
                callback: {
                    name: `BTF_removeErrorClassInput${index}`,
                    func: (event) => {
                        if (ele.value == "")
                            ele.classList.remove("wrong");
                    }
                }
            });
        });
    }
}
BaseTableForm.prototype.updateTitle = function() {
    if (this.formMode == "create")
        this.element.querySelector("h2").textContent = "Crear Registro";
    else if (this.formMode == "edit")
        this.element.querySelector("h2").textContent = "Editar Registro";
}
BaseTableForm.prototype.open = function() {
    return new Promise((resolve) => {
        this.element.classList.add("display");
        setTimeout(() => {
            this.element.classList.add("show");
            resolve();
        }, 10);
    });
}
BaseTableForm.prototype.close = function() {
    return new Promise((resolve) => {
        this.element.classList.remove("show");
        setTimeout(() => {
            this.element.classList.remove("display")
            resolve();
        }, Config.nav_time);
    });
}
BaseTableForm.prototype.clearForm = function() {
    const entries = [ ...this.entries.inputs, ...this.entries.textareas, ...this.entries.selects ];

    entries.forEach(ele => {
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
}
BaseTableForm.prototype.fillForm = function() {
    const data = DB.get({ table: this.table.DBTable, condition: this.rowIdCondition });
    Object.entries(data).forEach(([key, value]) => {
        this.entries.textareas.forEach(ele => {
            if (ele.name.replaceAll("-", "_") == key) {
                ele.value = value;
            }
        })
        this.entries.inputs.forEach(ele => {
            if (ele.name.replaceAll("-", "_") == key) {
                if (ele.getAttribute("type").toLowerCase() == "date")
                    ele.value = value.split("-").map(e => e.length > 1 ? e : "0"+e).join("-");
                else
                    ele.value = value;
            }
        });
        this.entries.selects.forEach(ele => {
            if (ele.name.replaceAll("-", "_") == key) {
                const advancedObject = Session.local.advancedSelects[ele.getAttribute("name").replaceAll("-", "_")];
                const [ option ] = Object.entries(advancedObject.options).find(([a, b]) => a.includes(value));
                advancedObject.selectOption(advancedObject.getOption(option).option);
            }
        });
    });
}
BaseTableForm.prototype.checkData = function(data, strictNotEmpty = true) {
    const setWrong = ele => {
        if (ele.tagName == "SELECT") {
            Session.local.advancedSelects[ele.name.replaceAll("-", "_")].setWrong();
            return;
        }
        ele.classList.add("wrong");
    };
    const unsetWrong = ele => {
        if (ele.tagName == "SELECT") {
            Session.local.advancedSelects[ele.name.replaceAll("-", "_")].unsetWrong();
            return;
        }
        ele.classList.remove("wrong");
    };
    const isSomeWrong = data.filter(ele => {
        let condition;

        if (this.uncheckFields.includes(ele.name) && ele.value == "") {
            unsetWrong(ele);
            return false;
        }

        condition = this.regExp[ele.name.replaceAll("-", "_")](ele.value);
        if (!strictNotEmpty)
            condition = ele.value == "" || condition;

        if (condition)
            unsetWrong(ele);
        else
            setWrong(ele);

        return !condition;
    });

    return isSomeWrong.length ? false : true;
}
BaseTableForm.prototype.compoundedData = function() {
    const data = {};

    this.entries.inputs.forEach(ele => {
        const name = ele.name.replaceAll("-", "_");
        if (["expiration_date", "creation_date"].includes(name))
            data[name] = ele.value.replaceAll(/\-0/g, "-")
        else
            data[name] = (this.upperFields.length && this.upperFields.includes(name)) ? ele.value.toUpperCase() : ele.value;
    });
    this.entries.selects.forEach(ele => data[ele.name.replaceAll("-", "_")] = ele.value);
    this.entries.textareas.forEach(ele => data[ele.name.replaceAll("-", "_")] = ele.value);

    return data;
}



export default BaseTableForm;