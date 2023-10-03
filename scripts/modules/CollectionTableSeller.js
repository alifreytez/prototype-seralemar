import BaseCollectionTable from "./base/BaseCollectionTable.js";
import TableFormCollection from "./TableFormCollectionSeller.js";
import TableContentCollection from "./TableContentCollectionSeller.js";

function CollectionTableSeller() {
    const tableHtml = `
        <div class="flex-wrap content-header">
            <h1>Cuadros de cobranza</h1>
            <form id="content-header-form" class="flex-wrap content-header-form">
                <div class="content-header-form-option">
                    <label for="filter-keyword">Por palabra clave</label>
                    <input type="text" id="filter-keyword" name="filter-keyword" placeholder="Escribe algo">
                </div>
                <div class="content-header-form-option">
                    <label for="filter-creation-date">Por mes de creación</label>
                    <div id="select-filter-creation-date" data-select-id="filter-creation-date" class="advanced-select">
                        <div class="flex-wrap option-text-wrapper">
                            <span class="option-text"></span>
                            <span class="option-menu-btn flex-wrap"><i class="fa-solid fa-angle-down"></i></span>
                        </div>
                        <ul class="menu"></ul>
                    </div>
                    <select name="filter-creation-date" id="filter-creation-date" data-object-id="select-filter-creation-date">
                        <option value="none">Sin especificar</option>
                        <option value="0">Enero</option>
                        <option value="1">Febrero</option>
                        <option value="2">Marzo</option>
                        <option value="3">Abril</option>
                        <option value="4">Mayo</option>
                        <option value="5">Junio</option>
                        <option value="6">Julio</option>
                        <option value="7">Agosto</option>
                        <option value="8">Septiembre</option>
                        <option value="9">Octubre</option>
                        <option value="10">Noviembre</option>
                        <option value="11">Diciembre</option>
                    </select>
                </div>
                <div class="content-header-form-option">
                    <label for="filter-debt-status">Por estado</label>
                    <div id="select-filter-debt-status" data-select-id="filter-debt-status" class="advanced-select">
                        <div class="flex-wrap option-text-wrapper">
                            <span class="option-text"></span>
                            <span class="option-menu-btn flex-wrap"><i class="fa-solid fa-angle-down"></i></span>
                        </div>
                        <ul class="menu"></ul>
                    </div>
                    <select name="filter-debt-status" id="filter-debt-status" data-object-id="select-filter-debt-status"></select>
                </div>
                <div class="content-header-form-option">
                    <label for="filter-payment-type">Por tipo de pago</label>
                    <div id="select-filter-payment-type" data-select-id="filter-payment-type" class="advanced-select">
                        <div class="flex-wrap option-text-wrapper">
                            <span class="option-text"></span>
                            <span class="option-menu-btn flex-wrap"><i class="fa-solid fa-angle-down"></i></span>
                        </div>
                        <ul class="menu"></ul>
                    </div>
                    <select name="filter-payment-type" id="filter-payment-type" data-object-id="select-filter-payment-type"></select>
                </div>
            </form>
        </div>
        <div class="table-wrapper seller">
            <div class="table-wrapper-in">
                <table id="collection-table">
                    <thead>
                        <tr>
                            <th><button type="button" id="select-all-rows" class="btn-select-all-rows" data-selected="0"><i class="fa-regular fa-square"></i></button></th>
                            <th>Nro Factura</th>
                            <th>RIF Cliente</th>
                            <th>Monto $</th>
                            <th>Monto BsD</th>
                            <th>Deuda rst.</th>
                            <th>Tasa</th>
                            <th>Tipo de pago</th>
                            <th>Estado</th>
                            <th>Fecha de expiración</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="mayor-options flex-wrap seller">
            <div id="pagination" class="pagination"></div>
        </div>
    `;
    const formHtml = `
        <button type="button" id="close-form" class="btn-close-form"><i class="fa-solid fa-x"></i>Cerrar</button>
        <div class="management-wrapper">
            <h2></h2>
            <div class="inside-wrapper">
                <div class="box-doble flex-wrap first">
                    <div class="box">
                        <label for="">Nro Factura</label>
                        <input type="text" name="invoice-number" placeholder="Ej.: FAC000">
                    </div>
                    <div class="box">
                        <label for="">Cliente</label>
                        <input type="text" name="client-rif" placeholder="Ej.: J-0000000">
                    </div>
                </div>
                <div class="box-doble flex-wrap">
                    <div class="box">
                        <label for="">Monto en dólares</label>
                        <input type="text" name="dollar-amount" placeholder="Ej.: 1000">
                    </div>
                    <div class="box">
                        <label for="">Monto en bolívares</label>
                        <input type="text" name="bolivar-amount" placeholder="Ej.: 1000">
                    </div>
                </div>
            <div class="box-doble flex-wrap">
                <div class="box">
                    <label for="">Deuda Restante</label>
                    <input type="text" name="remaining-debt" placeholder="Ej.: 1000">
                </div>
                <div class="box">
                    <label for="">Tasa de cambio</label>
                    <input type="text" name="exchange-rate" placeholder="Ej.: 1000">
                </div>
            </div>
                <div class="box-doble flex-wrap">
                    <div class="box">
                        <label for="payment-type">Tipo de pago</label>
                        <div id="select-payment-type" data-select-id="payment-type" class="advanced-select">
                            <div class="flex-wrap option-text-wrapper">
                                <span class="option-text"></span>
                                <span class="option-menu-btn flex-wrap"><i class="fa-solid fa-angle-down"></i></span>
                            </div>
                            <ul class="menu"></ul>
                        </div>
                        <select name="payment-type" id="payment-type" data-object-id="select-payment-type"></select>
                    </div>
                    <div class="box">
                        <label for="debt-status">Estado de la deuda</label>
                        <div id="select-debt-status" data-select-id="debt-status" class="advanced-select">
                            <div class="flex-wrap option-text-wrapper">
                                <span class="option-text"></span>
                                <span class="option-menu-btn flex-wrap"><i class="fa-solid fa-angle-down"></i></span>
                            </div>
                            <ul class="menu"></ul>
                        </div>
                        <select name="debt-status" id="debt-status" data-object-id="select-debt-status"></select>
                    </div>
                </div>
                <div class="box">
                    <label for="observation">Observación</label>
                    <textarea name="observation"></textarea>
                </div>
                <div class="box">
                    <label for="date">Fecha de expiración</label>
                    <input type="date" name="expiration-date">
                </div>
                <div class="box flex-wrap options">
                    <button type="submit" id="submit-form">Solicitar cambios</button>
                </div>
                <input type="hidden" name="user_id" value="">
            </div>
        </div>
    `;
    this.super({ tableHtml, formHtml, tableComponent: TableContentCollection, formComponent: TableFormCollection })
    
    this.ini();
}

CollectionTableSeller.prototype = new BaseCollectionTable();
CollectionTableSeller.prototype.constructor = CollectionTableSeller;
CollectionTableSeller.prototype.super = BaseCollectionTable;

CollectionTableSeller.prototype.ini = function() {}
CollectionTableSeller.prototype.assignEvents = function() {}

export default CollectionTableSeller;