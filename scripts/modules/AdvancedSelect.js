function AdvancedSelect({ objectId, elementName } = {}) {
    this.objectId = objectId;
    this.elementName = elementName;
    this.openedMenu = false;
    this.switchingMenu = null;
    this.options = {};
    this.inputElement = null;
    this.advancedElement = null;
    this.advancedSelectMenu = null;
    this.advancedSelectText = null;
    this.advancedSelectBtn = null;
    this.optionPrefix = "O_";

    try {
        this.prepare();
        this.interpolate();
        this.assignBehavior();
    } catch (e) {
        console.log(e);
    }
}

AdvancedSelect.reload = function(container) {
    if (!Object.getOwnPropertyNames(container.inputs).includes(selectComponentName))
        return null;

    const { objectId, elementName } = container.inputs[selectComponentName].advancedElement;
    container.inputs[selectComponentName].advancedElement = new AdvancedSelect({ objectId, elementName, container });
    return true;
}

AdvancedSelect.prototype.prepare = function() {
    this.advancedElement = document.getElementById(this.objectId);
    this.inputElement = document.querySelector(`[name='${this.elementName}']`);
    this.advancedSelectMenu = this.advancedElement.querySelector(".menu");
    this.advancedSelectText = this.advancedElement.querySelector(".option-text");
    this.advancedSelectBtn = this.advancedElement.querySelector(".option-menu-btn");

    if (this.objectId == null)
        throw "id is null"
    else if (this.inputElement == null)
        throw "elements do not exist or they are invalid"
    
    this.inputElement.querySelectorAll("option").forEach((element) => {
        this.options[`${this.optionPrefix}${element.value}`] = element;
    });
}
AdvancedSelect.prototype.interpolate = function() {
    const optionsFragment = new DocumentFragment();

    Object.entries(this.options).forEach(([, element]) => {
        const li = document.createElement("li");
        li.dataset.value = `${this.optionPrefix}${element.value}`;
        li.dataset.selected = element.selected;
        li.textContent = element.textContent;
        
        if (element.selected)
            this.advancedSelectText.textContent = element.textContent;

        optionsFragment.appendChild(li);
    });
    
    this.advancedSelectMenu.innerHTML = "";
    this.advancedSelectMenu.appendChild(optionsFragment);
}
AdvancedSelect.prototype.assignBehavior = function() {
    document.addEventListener("click", () => {
        const target = event.target;

        if (target.matches(`#${this.objectId} li, #${this.objectId} li *`)) {
            this.selectOption(this.getOption(target.dataset.value).option);
        }

        if (target.matches(`#${this.objectId} .option-text-wrapper, #${this.objectId} .option-text-wrapper *`))
            this.switchMenu();
        
        if (target.matches(`*:not(#${this.objectId} *)`))
            this.closeMenu();
    });
}
AdvancedSelect.prototype.getOption = function(option) {
    const target = Object.entries(this.options).find(([key, value]) => key == option);

    return { prefixedOption: target[0], option: target[0].replace(new RegExp(`^${this.optionPrefix}`), ""), element: target[1] };
}
AdvancedSelect.prototype.selectOption = function(optionValue) {
    const changeEvent = new Event("change");
    let target = null;
    // Update select list element
    Object.values(this.options).forEach(element => {
        if (element.value == optionValue) {
            element.setAttribute("selected", true);
            target = element;

            return;
        }
        element.removeAttribute("selected");
    });
    // Update menu list element
    this.advancedSelectMenu.querySelector("li[data-selected=true]").dataset.selected = false;
    this.advancedSelectMenu.querySelector(`li[data-value="O_${optionValue}"]`).dataset.selected = true;
    this.advancedSelectText.textContent = target.textContent;
    this.inputElement.dispatchEvent(changeEvent);
    this.closeMenu();
}
AdvancedSelect.prototype.setWrong = function() {
    this.advancedSelectText.parentElement.classList.add("wrong");
}
AdvancedSelect.prototype.unsetWrong = function() {
    this.advancedSelectText.parentElement.classList.remove("wrong");
}
AdvancedSelect.prototype.openMenu = function() {
    if (this.openedMenu)
        return;
    clearTimeout(this.switchingMenu);
    this.openedMenu = true;
    this.switchingMenu = setTimeout(() => {
        this.advancedElement.querySelector(".menu").classList.add("display");
        this.advancedSelectMenu.scrollTop = 0;
        this.reorganizeMenuPosition();
        this.advancedSelectBtn.classList.add("opened");
        setTimeout(() => this.advancedSelectMenu.classList.add("show"), 10);
        setTimeout(() => {
            this.switchingMenu = null;
            this.switchingMenu = null;
        }, 500);
    }, 0);
}
AdvancedSelect.prototype.closeMenu = function() {
    if (!this.openedMenu)
        return;
    clearTimeout(this.switchingMenu);
    this.advancedElement.querySelector(".menu").classList.remove("show");
    this.advancedSelectBtn.classList.remove("opened");
    this.advancedSelectMenu.classList.remove("display");
    this.openedMenu = false;
}
AdvancedSelect.prototype.switchMenu = function() {
    const action = this.openedMenu ? this.closeMenu : this.openMenu;
    action.call(this);
}
AdvancedSelect.prototype.reorganizeMenuPosition = function() {
    const pos = this.getRelativePosition();
    const documentHeight = document.body.offsetHeight;
    const menuHeight = this.advancedSelectMenu.offsetHeight;
    const menuWrapperHeight = this.advancedSelectMenu.parentElement.offsetHeight;
    const diff = documentHeight - (pos + menuWrapperHeight + menuHeight + 20);

    // Menu will appear downwards
    if (diff > 10) {
        this.advancedSelectMenu.classList.remove("top-position");
        this.advancedSelectMenu.classList.add("bottom-position");
        return;
    }

    // Menu will appear upwards
    this.advancedSelectMenu.classList.remove("bottom-position");
    this.advancedSelectMenu.classList.add("top-position");
}
AdvancedSelect.prototype.getRelativePosition = function() {
    let posTop = 0;
    let ele = this.advancedSelectMenu.parentElement;
    while(ele && !isNaN(ele.offsetTop)) {
        posTop += ele.offsetTop - ele.scrollTop;
        ele = ele.offsetParent;
    }
    // Position of the element with respect to the body of the document
    return posTop;
}

export default AdvancedSelect;