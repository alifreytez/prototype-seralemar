import EventAssign from "./EventAssign.js";
import Config from "../config.js";
import DB from "../db.js";
import Session from "../session.js";

function ReminderModalDay({ date, sellerId } = {}) {
    this.element = null;
    this.reminderList = null;
    this.collectionTableList = null;
    this.data = { collection_tables: [], reminders: [] };

    this.ini({ date, sellerId });
}

ReminderModalDay.prototype.ini = function({ date, sellerId } = {}) {
    this.element = document.getElementById("modal-day");
    this.collectionTableList = this.element.querySelector(".modal-collection-tables-list");
    this.reminderList = this.element.querySelector(".modal-reminders-list");
    this.date = date;
    this.sellerId = sellerId;

    if (Session.loginInfo().position == 1)
        this.reminderList.classList.add("hidden");
    else
        this.reminderList.classList.remove("hidden");

    this.assignEvents();
    this.update();
}
ReminderModalDay.prototype.assignEvents = function() {
    EventAssign.list.clean({ family: "RMD", match: true });
    EventAssign.add({
        eventType: "click",
		callback: {
            name: "RMD_closeForm",
            func: (event) => {
                if (event.target.matches("#close-modal-day, #close-modal-day > *"))
                    this.close();
            }
        }
    });
}
ReminderModalDay.prototype.open = function() {
    return new Promise((resolve) => {
        this.element.classList.add("display");
        setTimeout(() => {
            this.element.classList.add("show");
            resolve();
        }, 10);
    });
}
ReminderModalDay.prototype.close = function() {
    return new Promise((resolve) => {
        this.element.classList.remove("show");
        setTimeout(() => {
            this.element.classList.remove("display")
            resolve();
        }, Config.nav_time);
    });
}
ReminderModalDay.prototype.update = function() {
    this.prepareData();
    this.fill();
}
ReminderModalDay.prototype.prepareData = function() {
    let collection_tables = DB.get({ table: "collection_tables" });
    let reminders = DB.get({ table: "reminders" });

    this.data.collection_tables = collection_tables.filter(({ user_id, expiration_date }) => {
        if (this.sellerId == null)
            return expiration_date == this.date;

        return user_id == this.sellerId && expiration_date == this.date;
    });
    this.data.reminders = reminders.filter(({ execute_date }) => {
        return execute_date == this.date;
    });
}
ReminderModalDay.prototype.fill = function() {
    let tbodyCollectionTables = "", tbodyReminders = "";

    /* Filling */

    // collection table
    this.data.collection_tables.forEach(row => {
        tbodyCollectionTables += `
            <tr">
                <td>${row.invoice_number}</td>
                ${Session.loginInfo().position == 0 ? `<td>${row.user_id}</td>` : ""}                
                <td>${row.client_rif}</td>
                <td>${row.dollar_amount}</td>
                <td>${row.bolivar_amount}</td>
                <td>${row.remaining_debt}</td>
                <td>${row.payment_type}</td>
                <td>${row.debt_status}</td>
                <td>${row.expiration_date}</td>
            </tr>
        `;
    });
    // reminders
    this.data.reminders.forEach(row => {
        tbodyReminders += `
            <tr>
                <td>${row.by_user_id}</td>
                <td>${row.to_user_id}</td>
                <td>${row.message}</td>
                <td>${row.execute_date}</td>
            </tr>
        `;
    });

    this.collectionTableList.querySelector("tbody").innerHTML = tbodyCollectionTables;
    this.reminderList.querySelector("tbody").innerHTML = tbodyReminders;
}


export default ReminderModalDay;