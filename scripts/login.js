import DB from "./db.js";
import Session from "./session.js"
import FormLogin from "./modules/FormLogin.js";
DB.ini();

document.addEventListener("DOMContentLoaded", function() {
    if (Session.manageLogin())
        window.location = Session.loginInfo().position == 0 ? "statistics.html" : "collection-tables.html";

    new FormLogin();
});