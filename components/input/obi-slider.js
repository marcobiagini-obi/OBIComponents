import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";

defineComponent({
    selector: "obi-slider",
    template: `<div obi-slider :disabled='disabled'>
            <label cmd-if='$.label'>{{label}}</label>
            <div slider-container>
                <input type='range' :min='min' :max='max' cmd-model='valore' @click='updateProgressBar' :disabled='disabled' :required='required' @change='triggerChange'/>
                <input type='number' :min='min' :max='max' cmd-model='valore' :disabled='disabled' @change='triggerChange'/>
            </div>
		    <span message cmd-if='$.messaggio' class='txt-body2'>{{messaggio}}</span>
        </div>`,
    options: {
        dataset: {
            max: 100,
            min: 1,
            valore: 0,
        },
        inputs: ["label", "valore", "max", "min", "disabled"],
        actions: {
            updateProgressBar() {
                let slider = this.__node.reference[0].querySelector("input[type='range']");
                if (slider) {

                    let val = slider.value;
                    let width = slider.clientWidth;
                    let slider_width = (val - this.min) * width / (this.max - this.min);

                    var offset = 20;

                    let slider_dot = ((val - this.min) * (width - offset) / (this.max - this.min)) - 10;


                    this.__node.reference[0].style.setProperty("--slider-width", slider_width + "px");
                    this.__node.reference[0].style.setProperty("--slider-dot", slider_dot + "px");
                }
            },
            triggerChange() {
                this.__node.trigger("changed", this.value);
            },
            isValid() {
                return !this.required || this.required && this.valore != null && this.valore != "" && !isNaN(this.valore);
            }
        },
        computed: {
            value() {
                return this.valore;
            },
            required: function () {
                return this.__element.getAttribute("required") != null;
            },
        },
        events: [
            {
                name: "update",
                action: function (evt) {
                    this.updateProgressBar();
                }
            },
            {
                name: Collection.node_event.progress,
                action: function (state) {
                    if (state == Collection.lifecycle.ready) try { this.updateProgressBar(); } catch (ex) { console.error(ex); }
                }
            }
        ]
    }
});