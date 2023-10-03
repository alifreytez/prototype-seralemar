import Session from "./session.js"
import PageNav from "./modules/PageNav.js";
import DB from "./db.js";
import Notification from "./modules/Notification.js";
DB.ini();

document.addEventListener("DOMContentLoaded", function() {
    if (!Session.manageLogin())
        window.location = "login.html";

    const { employee_name, position_name } = Session.loginInfo();
    document.getElementById("user-name").textContent = employee_name;
    document.getElementById("user-role").textContent = position_name;

    // Page Nav Menu
    new PageNav("nav-menu");

    // Notifications
    new Notification();
});