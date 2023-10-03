import DB from "../db.js";
import Config from "../config.js";
import EventAssign from "./EventAssign.js";
import FloatingMessage from "./FloatingMessage.js";

function NotificationModal({ parent, id } = {}) {
    this.parent = null;
    this.element = null;
    this.modalCollectionTables = null;
    this.modalReminders = null;
    this.id = null;

    this.ini({ parent, id })
}

NotificationModal.prototype.ini = function({ parent, id } = {}) {
    this.parent = parent;
    this.id = id;
    this.element = document.getElementById("modal-notification");
    this.modalCollectionTables = this.element.querySelector("#modal-notification-change-cc");
    this.modalReminders = this.element.querySelector("#modal-notification-reminder");

    this.modalCollectionTables.style.display = "none";
    this.modalReminders.style.display = "none";

    this.assignEvents();
    this.prepareData();
    this.fill();
}
NotificationModal.prototype.assignEvents = function() {
    EventAssign.list.clean({ family: "NTM", match: true });
    EventAssign.add({
        eventType: "click",
		callback: {
            name: "NTM_closeModal",
            func: (event) => {
                if (event.target.matches("#close-modal-notification, #close-modal-notification > *"))
                    this.close();
            }
        }
    });
    EventAssign.add({
        eventType: "click",
        callback: {
            name: "NTM_acceptCollectionTableChanges",
            func: (event) => {
                if (!event.target.matches("#modal-notification-accept, #modal-notification-accept > *"))
                    return;

                if (confirm("Cambiará un registro, ¿está seguro de hacerlo?"))
                    this.saveChanges();
            }
        }
    });
    EventAssign.add({
        eventType: "click",
        callback: {
            name: "NTM_declineCollectionTableChanges",
            func: (event) => {
                if (!event.target.matches("#modal-notification-decline, #modal-notification-decline > *"))
                    return;

                if (confirm("Descartará estos cambios, ¿está seguro de hacerlo?"))
                    this.discardChanges();
            }
        }
    });
}
NotificationModal.prototype.saveChanges = function() {
    const changedData = DB.get({ table: "collection_tables_changes", condition: { id: this.id } })
    const currentData = DB.get({ table: "collection_tables", condition: { invoice_number: changedData.invoice_number } });

    const result = DB.post({
        table: "collection_tables",
        condition: { invoice_number: currentData.invoice_number },
        data: changedData
    });
    if (result) {
        const result2 = DB.post({
            table: "collection_tables_changes",
            condition: { id: this.id },
            data: { change_status: 0 }
        });

        FloatingMessage.say("Cambios realizados exitosamente", "success");
        this.parent.panel.update();
        this.close();

        return;
    }

    FloatingMessage.say("No fue posible crear realizar los cambios", "error");
}
NotificationModal.prototype.discardChanges = function() {
    const result = DB.post({
        table: "collection_tables_changes",
        condition: { id: this.id },
        data: { change_status: 2 }
    });
    if (result) {
        FloatingMessage.say("Cambios descartados exitosamente", "success");
        this.parent.panel.update();
        this.close();

        return;
    }

    FloatingMessage.say("No fue posible descartar los cambios", "error");
}
NotificationModal.prototype.open = function() {
    return new Promise((resolve) => {
        this.element.classList.add("display");
        setTimeout(() => {
            this.element.classList.add("show");
            resolve();
        }, 10);
    });
}
NotificationModal.prototype.close = function() {
    return new Promise((resolve) => {
        this.element.classList.remove("show");
        setTimeout(() => {
            this.element.classList.remove("display")
            resolve();
        }, Config.nav_time);
    });
}
NotificationModal.prototype.prepareData = function() {}
NotificationModal.prototype.fill = function() {
    let html = "";

    if (this.parent.role == 0) {
        const changedData = DB.get({ table: "collection_tables_changes", condition: { id: this.id } })
        const currentData = DB.get({ table: "collection_tables", condition: { invoice_number: changedData.invoice_number } });
        const tableRows = (data) => {
            const full_data_row = {
                ...data,
                payment_type: DB.interpolate({ type: "payment_type", value: data.payment_type }),
                debt_status: DB.interpolate({ type: "debt_status", value: data.debt_status })
            };

            return `
                <tr>
                    <td>${full_data_row.invoice_number}</td>
                    <td>${full_data_row.user_id}</td>
                    <td>${full_data_row.client_rif}</td>
                    <td>${full_data_row.dollar_amount}</td>
                    <td>${full_data_row.bolivar_amount}</td>
                    <td>${full_data_row.remaining_debt}</td>
                    <td>${full_data_row.exchange_rate}</td>
                    <td>${full_data_row.payment_type}</td>
                    <td>${full_data_row.debt_status}</td>
                    <td>${full_data_row.expiration_date}</td>
                </tr>
            `
        };

        html = `
            <h2>Cambio en cuadro de cobranza</h2>
            <p class="request-date">Fecha de solicitud: <span>${changedData.request_date}</span></p>
            <div class="modal-notification-current-table">
                <h3>Cuadro actual</h3>
                <div class="table-wrapper">
                    <div class="table-wrapper-in">
                        <table id="table-modal-current-table">
                            <thead>
                                <tr>
                                    <th>Nro Factura</th>
                                    <th>Vendedor</th>
                                    <th>RIF Cliente</th>
                                    <th>Monto $</th>
                                    <th>Monto BsD</th>
                                    <th>Deuda rst.</th>
                                    <th>Tasa</th>
                                    <th>Tipo de pago</th>
                                    <th>Estado</th>
                                    <th>Fecha de expiración</th>
                                </tr>
                            </thead>
                            <tbody>
                            ${tableRows(currentData)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-notification-wished-table">
                <h3>Cuadro con cambios</h3>
                <div class="table-wrapper">
                    <div class="table-wrapper-in">
                        <table id="table-modal-wished-table">
                            <thead>
                                <tr>
                                    <th>Nro Factura</th>
                                    <th>Vendedor</th>
                                    <th>RIF Cliente</th>
                                    <th>Monto $</th>
                                    <th>Monto BsD</th>
                                    <th>Deuda rst.</th>
                                    <th>Tasa</th>
                                    <th>Tipo de pago</th>
                                    <th>Estado</th>
                                    <th>Fecha de expiración</th>
                                </tr>
                            </thead>
                            <tbody>
                            ${tableRows(changedData)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-notification-buttons flex-wrap">
                <div class="flex-wrap">
                    <button type="button" id="modal-notification-accept" class="accept-button">Aplicar cambios</button>
                    <button type="button" id="modal-notification-decline" class="decline-button">Descartar cambios</button>
                </div>
            </div>
        `;
        
        this.modalCollectionTables.style.display = "block";
        this.modalCollectionTables.innerHTML = html;
    } else {
        const data = DB.get({ table: "reminders", condition: { id: this.id } })

        html += `
            <h2>Recordatorio: ${data.title}</h2>
            <p class="modal-date">Fecha de ejecución: ${data.execute_date}</p>
            <p class="modal-reminder-message">${data.message}</p>
        `;
    }
}

export default NotificationModal;