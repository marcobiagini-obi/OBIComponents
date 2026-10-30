import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "stepper-item", //Tag HTML personalizzato per richiamare il componente
    template: `<div stepper-item :status="$.getStatus($.step.status)" :data-value="$.step.id">
                <obi-label column size="sm" :label="step.label" :valore="step.message"
                    :icona="$.getIcon($.step.status)">
                </obi-label>
                <span line></span>
            </div>`, //Template HTML del componente
    options: {
        inputs: ["step"], //lista di stringhe, indica i nomi degli attributi che permettono di sincronizzare dati con un contesto esterno
        dataset: {}, //set di dati del componente
        storage: {}, //set di dati indipendenti dall'aggiornamento dinamico dell'interfaccia
        computed: {
            current: function () { return this.__element.hasAttribute("current"); },
        }, //set di dati in sola lettura del componente
        actions: {
            getIcon(status) {
                switch (status) {
                    case 1: return this.current ? "check_circle" : "check";
                    case 2: return this.current ? "error" : "warning";
                    default: return this.current ? "radio_button_checked" : "circle";
                }
            },
            getStatus(id) {
                switch (id) {
                    case 1: return "done";
                    case 2: return "alert";
                    default: return "todo";
                }
            }
        }, //funzioni del componente
        events: [], //eventi del componente
        settings: {} //impostazioni del componente
    }
});