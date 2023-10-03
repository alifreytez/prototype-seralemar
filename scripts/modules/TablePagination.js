import Config from "../config.js";
import PaginationButtons from "./PaginationButtons.js";
import EventAssign from "./EventAssign.js";

function TablePagination(tableComponent) {
    this.table = tableComponent;
    this.totalPagesNumber = 0;
    this.pageIndex = 0;
    this.component = null;

    this.ini();
}

TablePagination.prototype.ini = async function() {
	// Gestion de eventos relacionados con este componente.
	this.assignEvents();
    this.update(1);
}
TablePagination.prototype.assignEvents = function() {
	/* Variables utilizadas en las funciones de los eventos. */
	const checkButton = (element = null) => {
		if (element == null)
			return null;

		let target = event.target;
		while (target.tagName != "BUTTON")
			target = target.parentElement;

		return { button: target, available: !target.classList.contains("not-available") };
	}

	// Mostrar página anterior.
	EventAssign.add({
		eventType: "click",
        target: "#pagination-prev, #pagination-prev *",
        callback: (event) => {
            const { button, available } = checkButton(event.target);
            if (available !== true)
                return;

            this.changePage("prev");
		}
	});
	// Mostrar página siguiente.
	EventAssign.add({
		eventType: "click",
        target: "#pagination-next, #pagination-next *",
        callback: (event) => {
            const { button, available } = checkButton(event.target);
            if (available !== true)
                return;

            this.changePage("next");
        }
	});
	// Mostrar página seleccionada.
	EventAssign.add({
		eventType: "click",
        target: "#pagination .pagination-btn, #pagination .pagination-btn *",
		callback: (event) => {
            const { button, available } = checkButton(event.target);
            if (available !== true)
            return;

            this.changePage(parseInt(button.textContent));
        }
	});
}
// Obtenemos el estado actual de totalPageNumber y totalRowsNumber
TablePagination.prototype.changePage = function(n = null) {
	let newPageIndex;

	newPageIndex = this.determinePageIndex(n);

	if (newPageIndex != false) {
		this.pageIndex = parseInt(newPageIndex);

		// Solicitud para renderizar CONTENT GRID
		this.table.fillTable(this.pageIndex);
		// Solicitud para renderizar CONTENT PAGINATION
		this.render();
	}
}
TablePagination.prototype.determinePageIndex = function(n = null) {
	const pageIndex = this.pageIndex;
	let newPageIndex, remainingRowsNumber;

	if (this.totalRowsNumber == null)
		return false;

	// Mostrar página anterior.
	if (n == "prev") {
		newPageIndex = pageIndex === 1 ? 1 : pageIndex - 1;
	}
	// Mostrar página siguiente.
	else if (n == "next") {
		remainingRowsNumber = (pageIndex + 1) * Config.rows_number - this.totalRowsNumber;
		newPageIndex = remainingRowsNumber >= Config.rows_number ? pageIndex : pageIndex + 1;
	}
	// Mostrar misma página.
	else if (n == null) {
		remainingRowsNumber = pageIndex * Config.rows_number - this.totalRowsNumber;
		newPageIndex = remainingRowsNumber == Config.rows_number ? pageIndex - 1 : pageIndex;
	}
	// Mostrar página específica.
	else {
		remainingRowsNumber = n * Config.rows_number - this.totalRowsNumber;
		newPageIndex = n < 1 || remainingRowsNumber >= Config.rows_number ? pageIndex : n;
	}

	return newPageIndex ? newPageIndex : 1;
}
TablePagination.prototype.prepareButtons = function() {
    const totalRows = this.table.data == null ? this.table.contentManager.data.length : this.table.data.length;
    const totalPagesNumber = Math.ceil(totalRows / Config.rows_number);
    const paginationButtons = new PaginationButtons({ totalPagesNumber, pageIndex: this.pageIndex });

	// Menor o igual a 5 páginas.
	if (totalPagesNumber <= 5)
		paginationButtons.workFor(5);
	// Igual a 6 páginas.
	else if (totalPagesNumber == 6)
		paginationButtons.workFor(6);
	// Mayor o igual a 7 páginas.
	else
		paginationButtons.workFor(7);

    this.component = paginationButtons;
    this.totalRowsNumber = totalRows;
    this.totalPagesNumber = totalPagesNumber;
}
TablePagination.prototype.update = function(pageIndex = 1) {
    this.prepareButtons(pageIndex);
	this.pageIndex = parseInt(pageIndex);
	this.render();
}
TablePagination.prototype.render = function() {
    this.prepareButtons();
    document.querySelector("#pagination").innerHTML = this.component.getHTMLContent().outerHTML;
}

export default TablePagination;