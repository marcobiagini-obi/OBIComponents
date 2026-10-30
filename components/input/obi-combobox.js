import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";
import "../../LAMP/RenderModule/modules/global.js";

defineComponent({
    selector: "obi-combobox",
    template:
        `<float-container obi-combobox :disabled="disabled">
            <obi-textbox float-toggle @keyup='checkText' :variant='variant' :append='append' :prepend='prepend'
                :label='label' :valore='selected_text' :messaggio='messaggio' :placeholder='placeholder' @click='select' :disabled="disabled">
            </obi-textbox>
            <obi-list floating-item interact variant='elevated'>
                <list-item float-toggle cmd-for='item in opzioni' :value='$.item.value' @click='select' cmd-filter='$.value ? true : item.label.toLowerCase().includes($.selected_text.toLowerCase())'>{{item.label}}</list-item>
            </obi-list>
        </float-container>`,
    options: {
        dataset: {
            selected_text: "",
            first_render: true,
        },
        inputs: ["opzioni", "label", "valore", "messaggio", "prepend", "append", "placeholder", "variant", "disabled"],
        computed: {
            value: function () {
                return this.valore;
            },
            required: function () {
                return this.__element.getAttribute("required") != null;
            },
        },
        actions: {
            isValid() {
                return (this.required && (this.value > 0 || this.value != "") && checkValue(this.__element.getAttribute("format"), this.value)) ||
                    (!this.required && checkValue(this.__element.getAttribute("format"), this.value));
                function checkValue(check, value) {
                    if (check) {
                        switch (check) {
                            case "email":
                                return Collection.regexp.mail.test(value);
                            case "multiemail":
                                return Collection.regexp.multiplemail.test(value);
                            case "numeric":
                                return Collection.regexp.numeric.test(value);
                            case "textual":
                                return Collection.regexp.textual.test(value);
                            case "date":
                                return Collection.regexp.dateformat.test(value);
                        }
                    }
                    return true;
                }
            },
            updateValidity() {
                let element = this.__element;
                let input = this.__element.querySelector("[obi-textbox]")?.virtual?.context;
                if (element && input) {
                    input.invalid = !this.isValid();
                }
            },
            select(evt) {
                let _option = evt.currentTarget;
                if (_option && _option.hasAttribute("value")) {
                    let _value = _option.getAttribute("value");
                    if (!isNaN(parseInt(_value))) _value = parseInt(_value);
                    if (_value != null) {
                        this.selected_text = _value ? _option.innerText : "";
                        this.valore = _value ? _value : 0;
                        this.__node.trigger("changed", this.valore);
                    }
                }
                this.updateValidity();
            },
            checkText(evt) {
                let text = evt.target.value;
                let valore = this.opzioni.find(e => e.label == text?.trim());
                this.valore = valore?.value ?? 0;
                this.updateValidity();
            },
            syncValue() {
                let _select = this.opzioni.find(e => e.value == this.valore);
                if (_select != null) this.selected_text = _select.label;
                else if (this.valore === 0 || this.valore === "") this.selected_text = "";
                this.updateValidity();
            },
        },
        events: [
            {
                name: Collection.node_event.progress,
                action: function (state) {
                    switch (state) {
                        case Collection.lifecycle.mounted:
                            this.syncValue();
                            break;
                    }
                }
            }
        ]
    }
}
);