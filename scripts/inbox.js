import Session from "./session.js"
import InboxAdmin from "./modules/InboxAdmin.js";
import InboxSeller from "./modules/InboxSeller.js";

document.addEventListener("DOMContentLoaded", function() {
    Session.pageAccess();

    if (Session.loginInfo().position == 0)
        new InboxAdmin();
    else
        new InboxSeller();
});