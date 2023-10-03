import Session from "./session.js"
import CollectionTableAdmin from "./modules/CollectionTableAdmin.js";
import CollectionTableSeller from "./modules/CollectionTableSeller.js";

document.addEventListener("DOMContentLoaded", function() {
    Session.pageAccess();

    if (Session.loginInfo().position == 0)
        new CollectionTableAdmin();
    else
        new CollectionTableSeller();
    
    document.getElementById("content-header-form").addEventListener("submit", function() {
        event.preventDefault();
    });
});