import DB from "../db.js";

function PaginationButtons({ totalPagesNumber, pageIndex }) {
	this.totalPagesNumber = totalPagesNumber;
	this.pageIndex = pageIndex;
	this.extremity = new Map([
		["prev", document.createElement("button")],
		["next", document.createElement("button")]
	]);
	this.points = new Map([
		["points1", document.createElement("button")],
		["points2", document.createElement("button")]
	]);
	this.pagination = new Map([
		["btn1", document.createElement("button")],
		["btn3", document.createElement("button")],
		["btn4", document.createElement("button")],
		["btn5", document.createElement("button")],
		["btn7", document.createElement("button")]
	]);
	this.variablePaginations = [
		this.pagination.get("btn3"),
		this.pagination.get("btn4"),
		this.pagination.get("btn5")
	];

	this.ini();
}

PaginationButtons.prototype.ini = function() {
	this.extremity.forEach((element, index) => element.setAttribute("id", `pagination-${index}`));
	this.extremity.get("prev").innerHTML = `<i class="fas fa-angle-double-left"></i>`;
	this.extremity.get("next").innerHTML = `<i class="fas fa-angle-double-right"></i>`;

	this.points.forEach((element, index) => {
		element.setAttribute("id", `pagination-${index}`);
		element.classList.add("pagination-points");
		element.textContent = "...";
	});

	this.pagination.forEach((element, index) => {
		element.setAttribute("id", `pagination-${index}`);
		element.classList.add("pagination-btn");
	});

	this.pagination.get("btn1").textContent = 1;
	this.pagination.get("btn7").textContent = this.totalPagesNumber;
}
PaginationButtons.prototype.workingUntil5 = function() {
	let pageNumber = 2;

	// Oculta botones segun la cantidad de páginas.
	switch (parseInt(this.totalPagesNumber)) {
		case 5:
			break;
		case 4:
			this.pagination.delete("btn5");
			break;
		case 3:
			["btn4", "btn5"].forEach(index => this.pagination.delete(index));
			break;
		case 2:
			["btn3", "btn4", "btn5"].forEach(index => this.pagination.delete(index));
			break;
		default:
			["btn3", "btn4", "btn5", "btn7"].forEach(index => this.pagination.delete(index));
	}
	
	// Asigna los números a cada página.
	this.variablePaginations.forEach(btn => btn != null ? btn.textContent = pageNumber++ : null);

	// Oculta botones de referencia (...).
	this.points.forEach((element, index) => this.points.delete(index));
}
PaginationButtons.prototype.workingFor6 = function() {
	let pageNumber = 2;

	// Index se encuentra en las primeras 3 páginas de la paginación.
	if (this.pageIndex < (this.totalPagesNumber - 2)) {
		// Asigna los números a cada página.
		this.variablePaginations.forEach(btn => btn != null ? btn.textContent = pageNumber++ : null);

		// Oculta botones de referencia (...).
		this.points.delete("points1");
	}
	// Index se encuentra en las últimas 3 páginas de la paginación.
	else {
		// Asigna los números a cada página.
		this.variablePaginations.forEach(btn => btn != null ? btn.textContent = ++pageNumber : null);
		
		// Oculta botones de referencia (...).
		this.points.delete("points2");
	}
}
PaginationButtons.prototype.workingBegining7 = function() {
	let pageNumber = 2;

	// Index se encuentra en las primeras 3 páginas de la paginación.
	if (this.pageIndex <= 3) {
		// Asigna los números a cada página.
		this.variablePaginations.forEach(btn => btn != null ? btn.textContent = pageNumber++ : null);

		// Oculta botones de referencia (...).
		this.points.delete("points1");
	}
	// Index se encuentra en la página central de la paginación.
	else if (this.pageIndex >= 4 && this.pageIndex <= (this.totalPagesNumber - 3)) {
		// Asigna los números a cada página.
		this.pagination.get("btn3").textContent = this.pageIndex - 1;
		this.pagination.get("btn4").textContent = this.pageIndex;
		this.pagination.get("btn5").textContent = this.pageIndex + 1;
	}
	// Index se encuentra en las últimas 3 páginas de la paginación.
	else if (this.pageIndex > (this.totalPagesNumber - 3)) {
		let a = 3;

		// Asigna los números a cada página.
		this.variablePaginations.forEach(btn => btn != null ? btn.textContent = this.totalPagesNumber - (a--) : null);

		// Oculta botones de referencia (...).
		this.points.delete("points2");
	}
}
// Asigna los estilos del botón de la página actual.
PaginationButtons.prototype.updateActualBtn = function() {
	this.pagination.forEach((element, index) => {
		const action = element.textContent == this.pageIndex ? "add" : "remove";

		element.classList[action]("actual");
	});
}
PaginationButtons.prototype.updateExtremityButtons = function() {
	// Si la paginación es de 1 página.
	if (this.totalPagesNumber <= 1)
		this.extremity.forEach((element, index) => this.extremity.delete(index));
	// Si la paginación es mayor a 1 página.
	else {
		// Si el index se encuentra en el primer botón, deshabilitamos botón 'previo'
		if (this.pageIndex == 1)
			this.extremity.delete("prev");
		// Si el index se encuentra en el úlimo botón, deshabilitamos botón 'previo'
		else if (this.pageIndex == this.totalPagesNumber)
			this.extremity.delete("next");
	}
}
PaginationButtons.prototype.workFor = function(pagesNumber) {
	switch (pagesNumber) {
		case 5:
			this.workingUntil5();
			break;
		case 6:
			this.workingFor6();
			break;
		case 7:
			this.workingBegining7();
			break;
		default:
	}
	
	this.updateActualBtn();
	this.updateExtremityButtons();
}
PaginationButtons.prototype.prepareButtons = function(btnList) {
	let buttons = [];

	btnList.forEach(btn => {
		if (btn != null)
			buttons.push(btn);
	});

	return buttons;
}
PaginationButtons.prototype.getHTMLContent = function() {
	const $div = document.createElement("div");
	let children = [
		this.extremity.get("prev"),
		this.pagination.get("btn1"),
		this.points.get("points1"),
		this.pagination.get("btn3"),
		this.pagination.get("btn4"),
		this.pagination.get("btn5"),
		this.points.get("points2"),
		this.pagination.get("btn7"),
		this.extremity.get("next")
	];

	$div.setAttribute("id", "pagination-wrap");
	$div.classList.add("pagination-wrap");
	$div.innerHTML = `${this.prepareButtons(children).map(btn => btn.outerHTML).join("")}`;

	return $div;
}

export default PaginationButtons;