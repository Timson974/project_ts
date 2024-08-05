"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("bootstrap/dist/css/bootstrap.min.css");
require("../styles/common.css");
const router_1 = require("./router");
class App {
    constructor() {
        this.router = new router_1.Router();
        window.addEventListener('DOMContentLoaded', this.handleRoutChanging.bind(this));
        window.addEventListener('popstate', this.handleRoutChanging.bind(this));
    }
    handleRoutChanging() {
        this.router.openRoute();
    }
}
(new App());
//# sourceMappingURL=app.js.map