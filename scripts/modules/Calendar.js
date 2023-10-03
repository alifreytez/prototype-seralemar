import DB from "../db.js";
import EventAssign from "./EventAssign.js";
import Session from "../session.js";
import ReminderForm from "./ReminderForm.js";
import ReminderGrid from "./ReminderGrid.js";
import TableContentReminder from "./TableContentReminder.js";
import ReminderModalDay from "./ReminderModalDay.js";

function Calendar() {
    this.element = null;
    this.grid = null;
    this.managementForm = null;
    this.contentManager = null;
    this.modalDay = null;
    this.sellerId = null;
    this.filters = {};
    this.DBTable = "reminders";

    this.ini();
}

Calendar.prototype.ini = function() {
    this.element = document.getElementById("reminder-table");
    document.querySelectorAll("#reminder-list input, #reminder-list select").forEach(ele => {
        this.filters[ele.name.replaceAll(/\-/g, "_")] = ele;
    });
    this.grid = new ReminderGrid(this);
    if (Session.loginInfo().position == 1)
        this.sellerId = Session.loginInfo().user_id;
    this.assignEvents();   
}
Calendar.prototype.assignEvents = function() {
    EventAssign.add({
        eventType: "click",
        target: ".day-wrapper .see-detail",
        callback: (event) => {
            const findDate = (e) => {
                let parent = e;
                do parent = parent.parentElement; while (parent.dataset.date == null);

                return parent.dataset.date;
            };

            this.modalDay = new ReminderModalDay({ date: findDate(event.target), sellerId: this.sellerId });
            this.modalDay.open();
        }
    });
    EventAssign.add({
        eventType: "change",
        origin: document.getElementById("filter-user-id"),
        callback: (event) => {
            this.sellerId = event.target.value == "none" ? null : event.target.value;
            this.grid.update();
        }
    });
    EventAssign.add({
        eventType: "click",
        target: "#btn-list-reminders, #btn-list-reminders > *",
        callback: (event) => {
            this.contentManager = new TableContentReminder({ tableObject: this, formComponent: ReminderForm });
            this.contentManager.open();
        }
    });
    EventAssign.add({
        eventType: "click",
        target: "#btn-prev-month, #btn-prev-month > *",
        callback: (event) => {
            this.grid.goPrevMonth()
        }
    });
    EventAssign.add({
        eventType: "click",
        target: "#btn-next-month, #btn-next-month > *",
        callback: (event) => {
            this.grid.goNextMonth()
        }
    });
    EventAssign.add({
        eventType: "click",
        target: "#btn-create-reminder, #btn-create-reminder > *",
        callback: (event) => {
            this.managementForm = new ReminderForm(this);
            this.managementForm.open();
        }
    });
}
Calendar.prototype.deleteRows = function(elements) {
    const findRowId = (target) => { 
        let parent = target;
        do parent = parent.parentElement; while (parent.tagName != "TR")
        return parent.dataset.rowId;
    };
    
    if (!elements.length || !confirm("Procederá a eliminar registros, ¿está seguro?"))
        return;

    elements.forEach(ele => {
        DB.delete({ table: this.DBTable, condition: { id: findRowId(ele) } });
    });
    
    this.contentManager.update();
    this.contentManager.pagination.update();
    this.grid.update();
}

export default Calendar;