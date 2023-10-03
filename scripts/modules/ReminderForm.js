import DB from "../db.js";
import Session from "../session.js";
import AdvancedSelect from "./AdvancedSelect.js";
import EventAssign from "./EventAssign.js";
import Config from "../config.js";
import FloatingMessage from "./FloatingMessage.js";

function ReminderForm(parentComponent) {
    this.parent = null;
    this.element = null;
    this.regExp = {};
    this.entries = { inputs: [], selects: [], textareas: [] };

    this.ini(parentComponent);
}

ReminderForm.prototype.ini = function(parentComponent) {
    this.regExp = {
        user_id: value => /^[a-zA-Z]?\d+$/.test(value),
        message: value => /^[\w\s\?\!\(\)\=\&\%\$\#\"\'áéíóúÁÉÍÓÚñ\/\*\-\_\+\,\;\.\:\{\}\[\]]+$/.test(value),
        execute_date: value => /^\d{4}\-\d{1,2}\-\d{1,2}$/.test(value)
    }
    this.parent = parentComponent;
    this.element = document.getElementById("reminder-form");
    this.element.querySelectorAll("input").forEach(ele => this.entries.inputs.push(ele));
    this.element.querySelectorAll("select").forEach(ele => this.entries.selects.push(ele));
    this.element.querySelectorAll("textarea").forEach(ele => this.entries.textareas.push(ele));
    this.element.querySelectorAll("select").forEach((element) => {
        // Llenado de datos de los select en base a DB.
        const selectName = element.name.replace("filter-", "").replaceAll("-", "_");
        if (Object.keys(DB.get({ table: "relations" })).includes(selectName)) {
            const options = [
                element.name.includes("filter") ? `<option value="none">Sin especificar</option>` : "",
                ...DB.get({ table: "relations" })[selectName].map((string, index) => `<option value="${index}">${string}</option>`)
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
    this.clearForm();
    this.assignEvents();
}
ReminderForm.prototype.assignEvents = function() {
    EventAssign.list.clean({ family: "RMF", match: true });
    EventAssign.add({
        eventType: "click",
		callback: {
            name: "RMF_closeForm",
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
            name: "RMF_submitForm",
            func: (event) => {
                event.preventDefault()
            }
        }
    });
    EventAssign.add({
        eventType: "click",
		callback: {
            name: "RMF_sendForm",
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
                    name: `RMF_checkDataInput${index}`,
                    func: (event) => {
                        this.checkData([ ele ]);
                    }
                }
            });
            EventAssign.add({
                origin: ele,
                eventType: "blur",
                callback: {
                    name: `RMF_removeErrorClassInput${index}`,
                    func: (event) => {
                        if (ele.value == "")
                            ele.classList.remove("wrong");
                    }
                }
            });
        });
        this.entries.textareas.forEach((ele, index) => {
            EventAssign.add({
                origin: ele,
                eventType: "input",
                callback: {
                    name: `RMF_checkDataInput${index}`,
                    func: (event) => {
                        this.checkData([ ele ]);
                    }
                }
            });
            EventAssign.add({
                origin: ele,
                eventType: "blur",
                callback: {
                    name: `RMF_removeErrorClassInput${index}`,
                    func: (event) => {
                        if (ele.value == "")
                            ele.classList.remove("wrong");
                    }
                }
            });
        });
    }
}
ReminderForm.prototype.open = function() {
    return new Promise((resolve) => {
        this.element.classList.add("display");
        setTimeout(() => {
            this.element.classList.add("show");
            resolve();
        }, 10);
    });
}
ReminderForm.prototype.close = function() {
    return new Promise((resolve) => {
        this.element.classList.remove("show");
        setTimeout(() => {
            this.element.classList.remove("display")
            resolve();
        }, Config.nav_time);
    });
}
ReminderForm.prototype.clearForm = function() {
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
ReminderForm.prototype.checkData = function(data, strictNotEmpty = true) {
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
ReminderForm.prototype.compoundedData = function() {
    const data = {};

    this.entries.inputs.forEach(ele => {
        const name = ele.name.replaceAll("-", "_");
        data[name] = name == "execute_date" ? ele.value.replaceAll(/\-0/g, "-") : ele.value;
    });
    this.entries.selects.forEach(ele => data[ele.name.replaceAll("-", "_")] = ele.value);
    this.entries.textareas.forEach(ele => data[ele.name.replaceAll("-", "_")] = ele.value);

    return data;
}
ReminderForm.prototype.send = function() {
    const dataElements = [ ...this.entries.inputs, ...this.entries.selects, ...this.entries.textareas ];

    if (!this.checkData(dataElements))
        return false;
    
    let data = this.compoundedData();
    let result = null, id;

    // Verificamos que la fecha escogida
    if (new Date(data.execute_date).getTime() > new Date().getTime()) {
        // Preparamos la data
        data = {
            to_user_id: data.user_id,
            by_user_id: Session.get("logged").user_id,
            message: data.message,
            execute_date: data.execute_date,
            title: data.title
        };
        id = DB.get({ table: "reminders" }).reduce((acc, cur) => {
            return parseInt(cur.id) > acc ? parseInt(cur.id) : acc;
        }, 0) + 1;
        // Insertamos
        result = DB.put({ table: "reminders", data: { id, ...data } });
        if (result) {
            console.log(this)
            this.parent.grid.update();

            FloatingMessage.say("Recordatorio creado satisfactoriamente", "success");
            this.close();
            return;
        }
    }
    
    FloatingMessage.say("No fue posible crear el recordatorio", "error");
}

export default ReminderForm;