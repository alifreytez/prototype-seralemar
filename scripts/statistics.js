import DB from "./db.js";
import Session from "./session.js"
import Statistics from "./modules/Statistics.js"

document.addEventListener("DOMContentLoaded", function() {
    Session.pageAccess();

    new Statistics();
});
