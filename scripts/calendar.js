import Session from "./session.js"
import DB from "./db.js";
import AdvancedSelect from "./modules/AdvancedSelect.js";
import Calendar from "./modules/Calendar.js"

document.addEventListener("DOMContentLoaded", function() {
    Session.pageAccess();
    if (Session.loginInfo().position == 1)
        document.getElementById("top-lateral").style.display = "none";

    const sUserId = document.querySelector("#filter-user-id");

    // Llenado de datos de los select en base a DB.
    const selectName = sUserId.name.replace("filter-", "").replaceAll("-", "_");
    if (Object.keys(DB.get({ table: "relations" })).includes(selectName)) {
        const options = [
            sUserId.name.includes("filter") ? `<option value="none">Sin especificar</option>` : "",
            ...DB.get({ table: "relations" })[selectName].map((string, index) => `<option value="${index}">${string}</option>`)
        ];
        sUserId.innerHTML = options.join("");
    } else if (selectName == "user_id") {
        const options = [
            sUserId.name.includes("filter") ? `<option value="none">Sin especificar</option>` : "",
            ...DB.get({ table: "employees", condition: { position: 1 }, all: true }).map(({ user_id }) => `<option value="${user_id}">${user_id}</option>`)
        ];
        sUserId.innerHTML = options.join("");
    }
    Session.local.advancedSelects[sUserId.getAttribute("name").replaceAll("-", "_")] = new AdvancedSelect({
        objectId: sUserId.dataset.objectId,
        elementName: sUserId.getAttribute("name")
    });

    new Calendar();
});
