import DB from "../db.js";
import Session from "../session.js";

function ReminderGrid(tableObject) {
    this.element = null;
    this.monthNames = [];
    this.currentDate = null;
    this.currentDay = null;
    this.monthNumber = null;
    this.currentYear = null;
    this.btnPrevElement = null;
    this.btnNextElement = null;
    this.monthElement = null;
    this.gridElement = null;
    this.managementForm = null;
    this.contentManager = null;
    this.pagination = null;
    this.tableObject = null;
    this.ini(tableObject);
}

ReminderGrid.prototype.ini = function(tableObject) {
    this.element = document.getElementById("calendar-grid");
    this.tableObject = tableObject;
    this.monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];
    this.currentDate = new Date();
    this.currentDay = this.currentDate.getDate();
    this.monthNumber = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.btnPrevElement = document.getElementById("btn-prev-month");
    this.btnNextElement = document.getElementById("btn-next-month");
    this.monthElement = document.getElementById("month-name");
    this.gridElement = document.getElementById("calendar-grid");
    this.assignEvents();
    this.update();
}
ReminderGrid.prototype.assignEvents = function() {}
ReminderGrid.prototype.update = function() {
    this.currentDate.setFullYear(this.currentYear, this.monthNumber, this.currentDay);
    this.renderDays(this.monthNumber);
}
ReminderGrid.prototype.goPrevMonth = function () {
    if (this.monthNumber != 0) {
        this.monthNumber--;
    } else {
        this.monthNumber = 11;
        this.currentYear--;
    }
    
    this.update();
}
ReminderGrid.prototype.goNextMonth = function () {
    if (this.monthNumber != 11) {
        this.monthNumber++;
    } else {
        this.monthNumber = 0;
        this.currentYear++;
    }

    this.update();
}
ReminderGrid.prototype.renderDays = function(monthNumber) {
    const html = [];
    let allCollectionTables = DB.get({ table: "collection_tables" });
    let allReminders = DB.get({ table: "reminders" });
    
    for (let i = 1; i <= this.getTotalDays(monthNumber); i++) {
        const date = `${this.currentYear}-${this.monthNumber + 1}-${i}`.replaceAll(/\-0/g, "-");
        let debts = 0, reminders = 0;

        if (this.tableObject.sellerId != null) {
            allCollectionTables = allCollectionTables.filter((e) => e.user_id == this.tableObject.sellerId);
            allReminders = allReminders.filter((e) => e.to_user_id == this.tableObject.sellerId);
        }

        allCollectionTables.forEach(({ expiration_date }) => debts = expiration_date == date ? debts + 1 : debts);
        allReminders.forEach(({ execute_date }) => reminders = execute_date == date ? reminders + 1 : reminders);

        html.push(`
            <div class="day-wrapper flex-wrap" data-date="${date}">
                <span class="day-text flex-wrap">${i}</span>
                <div class="day-info">
                    <p class="day-notice flex-wrap">
                        <i class="fa-solid fa-file-invoice-dollar">
                        </i><span class="lore">Deudas expiran:</span>
                        <span class="number">${debts}</span>
                    </p>
                    ${
                        Session.loginInfo().position == 0
                        ? `<p class="day-notice flex-wrap">
                            <i class="fa-solid fa-clock"></i>
                            <span class="lore">Recordatorios:</span>
                            <span class="number">${reminders}</span>
                        </p>`
                        : ""
                    }
                </div>
                <button type="button" class="see-detail">Ver detalle</button>
            </div>
        `);
    }
    this.gridElement.innerHTML = html.join("");
    this.monthElement.textContent = this.monthNames[this.monthNumber] + ` / ${this.currentYear}`;
}
ReminderGrid.prototype.getTotalDays = function(monthNumber) {
    if (monthNumber === -1)
        monthNumber = 11;

    if ([0,2,4,6,7,9,11].includes(monthNumber))
        return 31
    else if ([3,5,8,10].includes(monthNumber))
        return 30;
    else
        return this.isLeap() ? 29 : 28;
}
ReminderGrid.prototype.isLeap = function() {
    return ((this.currentYear % 100) !== 0 && (this.currentYear % 4 === 0)) || (this.currentYear % 400 === 0);
}

export default ReminderGrid;