export class AddOptions {

    static addOptions(options, idElement) {
        const selectElement = document.getElementById(idElement);
        while (selectElement.childNodes.length > 3) {
            selectElement.removeChild(selectElement.lastChild);
        }
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', `${option.id}`);
            optionElement.innerText = `${option.title}`;
            selectElement.appendChild(optionElement);
        })
    }
}