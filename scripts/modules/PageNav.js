import Session from "../session.js"
import Config from "../config.js"

function PageNav(idMenu = null, page) {
    this.menuElement = null;
    this.event = null;
    this.windowTimeType = null;
    this.showed = null;
    this.menus = {};
    this.page = page;

    this.ini({ idMenu });
}

PageNav.prototype.ini = function({ idMenu }) {
    this.menuElement = document.getElementById(idMenu);
    this.menus = [
        {
            href: "statistics.html",
            content: `<i class="fa-solid fa-chart-simple"></i><span>Estadísticas</span>`
        },
        {
            href: "calendar.html",
            content: `<i class="fa-solid fa-calendar-days"></i><span>Calendario</span>`
        },
        {
            href: "collection-tables.html",
            content: `<i class="fa-solid fa-clipboard-list"></i><span>Cuadros de cobranza</span>`
        },
        {
            href: "users.html",
            content: `<i class="fa-solid fa-users"></i><span>Usuarios</span>`
        },
        {
            href: "clients.html",
            content: `<i class="fa-solid fa-store"></i><span>Clientes</span>`
        },
        {
            href: "inbox.html",
            content: `<i class="fa-solid fa-inbox"></i><span>Bandeja de entrada</span>`
        }
    ];

    this.checkWindow();
    this.assignEvents();
    this.render();
}
PageNav.prototype.render = function() {
    const uri = window.location.pathname.replace("/prototype-seralemar/", "").replace("/", "");
    const pages = Config.page_access[Session.loginInfo().position_name.toLowerCase()];
    const list = this.menus.map(({ href, content }) => {
        if (pages.includes(href))
            return `<li><a href="${href}" class="flex-wrap${href == uri ? " current" : ""}">${content}</a></li>`;
            
        return null;
    });
    this.menuElement.innerHTML = `
        <ul>${list.filter(e => e).join("")}</ul>
        <div class="logo-wrapper"><img src="img/logo.jpg"></div>
    `;
}
PageNav.prototype.assignEvents = function() {
    // Update/Reset visual
    window.addEventListener("resize", this.checkWindow.bind(this));
    document.addEventListener("click", () => {
        const target = event.target;

        if (target.matches("#btn-open-menu, #btn-open-menu > *"))
            this.changeView();
    });
}
PageNav.prototype.changeView = async function() {
    if (this.changing != null)
        return;
    
    this.changing = true;

    if (this.showed)
        await this.hide();
    else
        await this.show();
    
    this.changing = null;
}
PageNav.prototype.hide = function() {
    return new Promise((resolve, reject) => {
        this.menuElement.classList.add("hide");
        this.changing = null;
        this.showed = false;
        setTimeout(() => resolve(), 500);
    });
}
PageNav.prototype.show = function() {
    return new Promise((resolve, reject) => {
        this.menuElement.classList.remove("hide");
        this.changing = null;
        this.showed = true;
        setTimeout(() => resolve(), 500);
    });
}
PageNav.prototype.checkWindow = function() {
    if (this.windowTimeType == null) {
        if (window.innerWidth > 800) {
            this.show();
            this.windowTimeType = "large";
        } else {
            this.hide();
            this.windowTimeType = "short";
        }
    } else if (this.windowTimeType != "short" && window.innerWidth < 800) {
        this.hide();
        this.windowTimeType = "short";
    } else if (this.windowTimeType != "large" && window.innerWidth > 800) {
        this.show();
        this.windowTimeType = "large";
    }
}

export default PageNav;