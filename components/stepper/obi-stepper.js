import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";

import "./stepper-item.js";
defineComponent({
    selector: "obi-stepper", //Tag HTML personalizzato per richiamare il componente
    template: `<div obi-stepper @click="navigate">
            <stepper-item cmd-for="item in steps" :step='item' :current=":index==$.current" :active="$.item.id==$.active"></stepper-item>
        </div>`, //Template HTML del componente
    options: {
        inputs: ["steps", "active"], //lista di stringhe, indica i nomi degli attributi che permettono di sincronizzare dati con un contesto esterno
        dataset: {
            current: 0,
        }, //set di dati del componente
        storage: {}, //set di dati indipendenti dall'aggiornamento dinamico dell'interfaccia
        computed: {
            interactable: function () {
                return this.__element.getAttribute("interact") != null;
            }
        }, //set di dati in sola lettura del componente
        actions: {
            navigate(evt) {
                if (this.interactable) {
                    let step = evt.target.closest("[stepper-item]").getAttribute("data-value");
                    this.set(step);
                }
            },
            next() {
                let previous = this.active;
                this.__node.trigger("done", this.steps[this.current]);
                this.steps[this.current].status = 1;
                if (this.current < this.steps.length - 1) {
                    this.current += 1;
                    // console.log(index + "; " + this.current);
                    this.active = this.steps[this.current].id;
                    this.__node.trigger("changed", this.active, previous);
                }
            },
            back() {
                let previous = this.active;
                this.__node.trigger("undone", this.steps[this.current]);
                if (this.current > 0 && this.steps[this.current].status != 1) {
                    this.current -= 1;
                    // console.log(index + "; " + this.current);
                    this.active = this.steps[this.current].id;
                    this.__node.trigger("changed", this.active, previous);
                }
                this.steps[this.current].status = 0;
            },
            set(step) {
                let previous = this.active;
                this.active = step;
                this.__node.trigger("changed", this.active, previous);
            },
            update() {
                if (this.active && Array.isArray(this.steps) && this.steps.some(e => e.id == this.active)) {
                    this.current = this.steps.findIndex(e => e.id == this.active);
                }
            },
        }, //funzioni del componente
        events: [
            {
                name: Collection.node_event.progress,
                action: function (state) { if (state == Collection.lifecycle.mounted) this.update(); }
            }
        ], //eventi del componente
        settings: {} //impostazioni del componente
    }
});