import Session from "../session.js"
import DB from "../db.js";
import EventAssign from "./EventAssign.js";
import FloatingMessage from "./FloatingMessage.js";

function FormLogin() {
    this.element = document.getElementById("login-form");
    this.conditions = {};
    this.entries = [];

    this.ini();
}

FormLogin.prototype.ini = function() {
    this.conditions = {
        user_id: value => /^\d+$/.test(value),
        password: value => /^[a-zA-Z\d\,\;\.\:\-\_\!\#\$\%\&\(\)\/\=\¡\?\¿\[\]\{\}\+\*]+$/.test(value)
    }
    this.element.querySelectorAll("input").forEach(ele => this.entries.push(ele));
    this.assignEvents();
}
FormLogin.prototype.assignEvents = function() {
    this.element.addEventListener("submit", () => event.preventDefault());
    EventAssign.add({
        eventType: "click",
        target: "#submit-form",
        callback: (event) => {
            this.send();
        }
    });
    this.entries.forEach(ele => {
        EventAssign.add({
            eventType: "input",
            origin: ele,
            callback: (event) => {
                this.checkData([ ele ]);
            }
        });
        EventAssign.add({
            eventType: "blur",
            origin: ele,
            callback: (event) => {
                if (ele.value == "")
                    ele.classList.remove("wrong");
            }
        });
    });
}
FormLogin.prototype.checkData = function(data, strictNotEmpty = true) {
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
        let condition = this.conditions[ele.name.replaceAll("-", "_")](ele.value);
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
FormLogin.prototype.compoundedData = function() {
    const data = {};

    this.entries.forEach(ele => data[ele.name.replaceAll("-", "_")] = ele.value);

    return data;
}
FormLogin.prototype.send = function() {
    if (!this.checkData([ ...this.entries ])) {
        FloatingMessage.say("Los datos no están correctamente formados", "error");
        return;
    }


    const date = new Date();
    const accessInfo = DB.get({ table: "user_access", condition: this.compoundedData() })
    let employeeInfo, positionInfo;

    if (accessInfo == null) {
        FloatingMessage.say("Los datos no coinciden con ningún usuario", "error");
        return;
    }

    employeeInfo = DB.get({ table: "employees", condition: { user_id: this.compoundedData().user_id } })
    positionInfo = DB.get({ table: "positions", condition: { id: employeeInfo.position } })

    
    Session.add({
        logged: {
            login_date: date.getTime(),
            user_id: accessInfo.user_id,
            employee_name: employeeInfo.name,
            position: employeeInfo.position,
            position_name: positionInfo.position_name
        }
    });

    window.location = Session.loginInfo().position == 0 ? "statistics.html" : "calendar.html";
}

export default FormLogin;