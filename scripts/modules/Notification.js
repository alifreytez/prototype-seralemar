import Session from "../session.js";
import NotificationPanel from "./NotificationPanel.js";

function Notification() {
    this.element = null;
    this.DBTable = "collection_tables_changes";
    this.oldData = {};
    this.wishedData = {};
    this.panel = null;
    this.modal = null;

    this.ini();
}

Notification.prototype.ini = function() {
    this.element = document.getElementById("modal-notification");
    this.role = Session.loginInfo().position;
    this.panel = new NotificationPanel({ parent: this, role: this.rolw });

    this.assignEvents();
}
Notification.prototype.assignEvents = function() {}

export default Notification;