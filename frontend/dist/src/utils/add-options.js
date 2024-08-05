"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOptions = void 0;
class AddOptions {
    static addOptions(options, idElement) {
        const selectElement = document.getElementById(idElement);
        if (selectElement && selectElement && selectElement.lastChild) {
            while (selectElement.childNodes.length > 3) {
                selectElement.removeChild(selectElement.lastChild);
            }
        }
        options.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', `${option.id}`);
            optionElement.innerText = `${option.title}`;
            if (selectElement) {
                selectElement.appendChild(optionElement);
            }
        });
    }
}
exports.AddOptions = AddOptions;
//# sourceMappingURL=add-options.js.map