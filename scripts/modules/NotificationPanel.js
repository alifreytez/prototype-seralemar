import DB from "../db.js";
import EventAssign from "./EventAssign.js";
import NotificationModal from "./NotificationModal.js";
import Config from "../config.js";

function NotificationPanel({ parent } = {}) {
    this.parent = null;
    this.element = null;
    this.data = [];
    this.opened = false;
    this.process = false;

    this.ini({ parent });
}

NotificationPanel.prototype.ini = function({ parent } = {}) {
    this.parent = parent;
    this.element = document.getElementById("notification-wrapper");

    this.prepareData();
    this.fill();
    this.assignEvents();
}
NotificationPanel.prototype.assignEvents = function() {
    const findId = (target) => { 
        let parent = target;
        do parent = parent.parentElement; while (parent.dataset.requestId == undefined)
        return parent.dataset.requestId;
    };
    EventAssign.list.clean({ family: "NTP", match: true });
    EventAssign.add({
        eventType: "click",
		callback: {
            name: "NTP_switchPanel",
            func: (event) => {
                if (!event.target.matches("#btn-open-close-notification, #btn-open-close-notification > *"))
                    return;

                if (this.opened) {
                    this.close();
                    this.opened = false;
                } else {
                    this.open();
                    this.opened = true;
                }
            }
        }
    });
    EventAssign.add({
        eventType: "click",
		callback: {
            name: "NTP_closePanel",
            func: (event) => {
                if (event.target.matches("#notification-wrapper, #notification-wrapper *")
                    || event.target.matches("#btn-open-close-notification, #btn-open-close-notification > *"))
                    return;
                    
                this.close();
                this.opened = false;
            }
        }
    });
    EventAssign.add({
        eventType: "click",
		callback: {
            name: "NTP_openModal",
            func: (event) => {
                if (!event.target.matches(".notification-panel-option, .notification-panel-option *"))
                    return;

                this.close();
                this.parent.modal = new NotificationModal({ parent: this.parent, id: findId(event.target) });
                this.parent.modal.open();
            }
        }
    });
}
NotificationPanel.prototype.open = function() {
    if (this.process)
        return;
    this.process = true;

    return new Promise((resolve) => {
        this.element.classList.add("display");
        setTimeout(() => {
            this.element.classList.add("show");
            this.process = false;
            resolve();
        }, 10);
    });
}
NotificationPanel.prototype.close = function() {
    if (this.process)
        return;
    this.process = true;

    return new Promise((resolve) => {
        this.element.classList.remove("show");
        setTimeout(() => {
            this.element.classList.remove("display");
            this.process = false;
            resolve();
        }, Config.nav_time);
    });
}
NotificationPanel.prototype.update = function() {
    this.prepareData();
    this.fill();
}
NotificationPanel.prototype.prepareData = function() {
    if (this.parent.role == 0) {
        const collection_tables_changes = DB.get({ table: this.parent.DBTable });
        this.data = collection_tables_changes.filter(({ change_status }) => change_status == 1);
    } else {
        const reminders = DB.get({ table: "reminders" });
        this.data = reminders.filter(({ change_status }) => change_status == 1);
    }
}
NotificationPanel.prototype.fill = function() {
    let html = "";

    if (this.parent.role == 0) {
        html += "<h4>Solicitudes de cambios de C.C.</h4>";
        html += "<ul>";
        if (this.data.length == 0) {
            html += `<li class="no-requests">No hay solicitudes pendientes.</li>`;
        } else {
            this.data.forEach(({ id, invoice_number, request_date }) => {
                html += `
                    <li data-request-id="${id}" class="notification-panel-option flex-wrap">
                        <div class="noti-icon-wrapper flex-wrap"><i class="fa-solid fa-clipboard-list"></i></div>
                        <div class="noti-text-wrapper flex-wrap">
                            <p>${invoice_number}</p>
                            <p><b>Fecha:</b> ${request_date}</p>
                        </div>
                    </li>
                `;
            });
        }
        html += "</ul>";
    } else {
        html += "<h4>Recordatorios</h4>";
        html += "<ul>";
        if (this.data.length == 0) {
            html += `<li class="no-reminders">No hay recordatorios.</li>`;
        } else {
            this.data.forEach(({ id, title }) => {
                html += `
                    <li data-reminder-id="${id}" class="notification-panel-option flex-wrap">
                        <div class="noti-icon-wrapper flex-wrap"><i class="fa-solid fa-clock"></i></div>
                        <div class="noti-text-wrapper flex-wrap">
                            <p>${title}</p>
                        </div>
                    </li>
                `;
            });
        }
        html += "</ul>";
    }
    
    this.element.innerHTML = html;
}

export default NotificationPanel;