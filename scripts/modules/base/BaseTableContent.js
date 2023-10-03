import EventAssign from "../EventAssign.js";

function BaseTableContent({ tableObject, formComponent } = {}) {
    if (tableObject == undefined)
        return;
    
    this.table = null;
    this.DBTable = "";
    this.element = null;
    this.data = [];
    this.formComponent = null;

    this.start({ tableObject, formComponent });
}

BaseTableContent.prototype = Object.create(null);
BaseTableContent.constructor = BaseTableContent;

BaseTableContent.prototype.start = function({ tableObject, formComponent } = {}) {
    if (tableObject == undefined)
        return;

    this.table = tableObject;
    this.form = formComponent;
    this.DBTable = tableObject.DBTable;
    this.element = tableObject.element.querySelector("tbody");
    this.startEvents();
    this.update();
}
BaseTableContent.prototype.startEvents = function() {    
    EventAssign.list.clean({ family: "BTC", match: true });
    const findRowId = (target) => { 
        let parent = target;
        do parent = parent.parentElement; while (parent.tagName != "TR")
        return parent.dataset.rowId;
    };
    const getSelectBtn = (ele) => {
        let btn = ele;
        while (btn.tagName != "BUTTON")
            btn = btn.parentElement; 
        return btn;
    };
    const changeSelectState = (ele, strict) => {
        const select = (ele) => {
            ele.querySelector("i").classList.remove("fa-regular");
            ele.querySelector("i").classList.add("fa-solid");
            ele.dataset.selected = 1;
        }
        const unselect = (ele) => {
            ele.querySelector("i").classList.remove("fa-solid");
            ele.querySelector("i").classList.add("fa-regular");
            ele.dataset.selected = 0;
        }

        if (strict != null) {
            if (strict) {
                select(ele);
                return;
            }
            unselect(ele);
            return;
        }
        if (parseInt(ele.dataset.selected)) {
            unselect(ele);
            return;
        }
        select(ele);
    };

    EventAssign.add({
        eventType: "click",
		callback: {
            name: "BTC_selectAllRows",
            func: (event) => {
                if (!event.target.matches("#select-all-rows, #select-all-rows > *"))
                    return;

                changeSelectState(getSelectBtn(event.target));
                const selectedState = parseInt(getSelectBtn(event.target).dataset.selected);
                this.element.querySelectorAll("tbody .btn-select-row").forEach(ele => changeSelectState(getSelectBtn(ele), selectedState));
            }
        }
    })
    EventAssign.add({
        eventType: "click",
		callback: {
            name: "BTC_selectRow",
            func: (event) => {
                if (!event.target.matches(".btn-select-row, .btn-select-row > *"))
                    return;
                
                changeSelectState(getSelectBtn(event.target));
            }
        }
    });
    EventAssign.add({
        eventType: "click",
		callback: {
            name: "BTC_openEditForm",
            func: (event) => {
                if (!event.target.matches(".btn-edit-row, .btn-edit-row > *"))
                    return;

                this.table.managementForm = new this.form({
                    formMode: "edit",
                    rowId: findRowId(event.target),
                    tableObject: this.table
                });
                this.table.managementForm.open();
            }
        } 
    });
    EventAssign.add({
        eventType: "click",
		callback: {
            name: "BTC_deleteRow",
            func: (event) => {
                if (!event.target.matches(".btn-delete-row, .btn-delete-row > *"))
                    return;
                
                this.table.deleteRows([ event.target ]);
            }
        } 
    });
}
BaseTableContent.prototype.update = function(page) {
    if (this.table == undefined)
        return;

    const selectAllBtn = document.querySelector("#select-all-rows");
    
    selectAllBtn.querySelector("i").classList.remove("fa-solid");
    selectAllBtn.querySelector("i").classList.add("fa-regular");
    selectAllBtn.dataset.selected = 0;
    this.prepareData();
    this.fillTable(page);
}

export default BaseTableContent;
