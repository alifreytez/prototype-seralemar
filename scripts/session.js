import DB from "./db.js";
import Config from "./config.js";

function Session() {}

Session.local = {
    advancedSelects: {},
    storagedList: []
};
Session.add = function(data) {
    if (data == null)
        return false;

    const [ [ key, value ] ] = Object.entries(data);
    
    localStorage.setItem(key.replaceAll("-", "_"), JSON.stringify(value));
    Session.local.storagedList.push(key.replaceAll("-", "_"));
}
Session.get = function(name) {
    return name == null ? false : JSON.parse(localStorage.getItem(name.replaceAll("-", "_")));
}
Session.loginInfo = function() {
    if (!Session.manageLogin()) {
        window.location.href = "login.html";
        return false;
    }

    const logged = Session.get("logged");
    return {
        user_id: logged.user_id,
        employee_name: logged.employee_name,
        position: logged.position,
        position_name: logged.position_name
    };
}
Session.pageAccess = function() {
    if (!Session.manageLogin()) {
        window.location.href = "login.html";
        return false;
    }
    const pathName = window.location.pathname.replace("/prototype-seralemar/", "").replace("/", "");
    
    if (!Config.page_access[this.loginInfo().position_name.toLowerCase()].includes(pathName))
        window.location.href = this.loginInfo().position == 0 ? "statistics.html" : "calendar.html";

    return true;
}
Session.manageLogin = function() {
    if (Session.get("logged") == null)
        return false;

    const logged = Session.get("logged");
    const currentDate = new Date();
    const givenDate = logged.login_date;
    const diff = Math.abs((currentDate.getTime() - parseFloat(givenDate)) / 1000);

    if (diff < 20*60) {
        logged.login_date = currentDate.getTime();
        Session.add({ logged });
        return true;
    }
    Session.add({ logged: null });
    return false;
}

export default Session;