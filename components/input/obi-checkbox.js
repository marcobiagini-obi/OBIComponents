import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";

defineComponent({
    selector: "obi-checkbox",
    template:
        `<label obi-checkbox>
            <input type="checkbox" cmd-model='valore' :disabled='disabled' @change='triggerChange'>
            <span input></span>
            {{label}}
        </label>`,
    options: {
        inputs: ["label", "valore", "disabled"],
        actions: {
            isValid: function () {
                return true;
            },
            updateValidity: function () {
            },
            triggerChange: function () {
                this.__node.trigger("changed", this.value);
            }
        },
        computed: {
            value: function () {
                let _reference = this.__node.reference[0];
                if (_reference) {
                    let _input = _reference.querySelector("input");
                    return _input ? _input.checked : false;
                }
                return null;
            },
            required: function () {
                return this.__element.getAttribute("required") != null;
            },
        }
    }
});

defineComponent({
    selector: "obi-check-component",
    template:
        `<test-template name='OBI CHECKBOX' description='' :code='code' :data='value'>
            <section actions slot='actions'>
                <obi-select :valore='variante' label='Variante' :opzioni='varianti'></obi-select>
                <obi-checkbox label='Disabilita' :valore='disabled' button></obi-checkbox>
            </section>
        </test-template>`,
    options: {
        dataset: {
            value: false,
            disabled: false,
            variante: "",
            varianti: [
                { label: "checkbox", value: "" },
                { label: "radio", value: "radio" },
                { label: "toggle", value: "toggle" },
                { label: "button", value: "button" },
            ]
        },
        computed: {
            code: function () {
                let _disabled = this.disabled ? " disabled" : "";
                return "<obi-checkbox :label='" + (this.value ? "checked" : "unchecked") + "' :valore='data' " + this.variante + _disabled + "></obi-checkbox>"
            }
        },
    }
});