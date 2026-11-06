import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "obi-checkgroup",
    template:
        `<group-component obi-checkgroup>
            <obi-button cmd-for='op in opzioni' @click='updateValue' :prepend='$.valore == $.op.value ? "check" : $.op.icona' :label='op.label' :title='op.title' :value='op.value' :relevance='$.valore == $.op.value ? $.relevance : null' :disabled="disabled" :variant='variant' style='flex-grow: 1;'></obi-button>
        </group-component>`,
    options: {
        inputs: ["opzioni", "valore"],
        actions: {
            isValid: function () {
                if (this.required) return this.valore != null && this.valore != "" && this.valore != 0;
                return true;
            },
            updateValidity: function () {
            },
            updateValue: function (evt) {
                let _val = evt.currentTarget.getAttribute("value");
                if (isNaN(parseFloat(_val))) this.valore = _val; else this.valore = parseFloat(_val);
                this.__node.trigger("changed", evt);
            }
        },
        computed: {
            value() {
                return this.valore;
            },
            required: function () {
                return this.__element.getAttribute("required") != null;
            },
            relevance: function () { return this.__element.hasAttribute("relevance") ? this.__element.getAttribute("relevance") : "primary"; },
            disabled: function () { return this.__element.hasAttribute("disabled") ? true : false; },
            variant: function () { return this.__element.getAttribute("variant"); }
        },
    }
});