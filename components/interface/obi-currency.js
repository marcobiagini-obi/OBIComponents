import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "obi-currency",
    template: `<span>{{stamp}}</span>`,
    options: {
        inputs: ["valore", "valuta", "locale"],
        dataset: {
            valore: 0,
        },
        actions: {
            stamp() {
                return stampCurrency(Number(this.valore), this.locale ?? "it-IT", this.valuta ?? "EUR");
            }
        },
    }
});

function stampCurrency(value, locale, currency) {
    return value.toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).trim();
}