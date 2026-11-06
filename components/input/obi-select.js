import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import "../../LAMP/RenderModule/modules/global.js";

defineComponent({
    selector: "obi-select",
    template:
        `<float-container obi-select :valid='$.valore != null && $.valore != 0 && $.valore != ""' :disabled="disabled">
	        <div text-input :disabled="disabled" :invalid='!$.isValid()'>
                <span cmd-if='icon' prepend class='material-symbols-outlined'>{{icon}}</span>
		        <div cmd-elseif='prepend' prepend>{{prepend}}</div>
                <label input float-toggle :disabled="disabled">{{selected}}</label>
		        <label title for='input' cmd-if='$.label'>{{label}}</label>
		        <div cmd-if='append' append>{{append}}</div>
		        <div text-indicator></div>
	        </div>
	        <div text-support>
		        <span message cmd-if='$.messaggio' class='txt-body2'>{{messaggio}}</span>
	        </div>
            <obi-list floating-item interact variant='elevated'>
                <list-item float-toggle cmd-for='item in opzioni' :value='$.item.value' @click='select' :active='$.value === $.item.value' :relevance="$.__storage.search && $.item.label.toLowerCase().startsWith($.__storage.search.toLowerCase()) ? 'neutral' : null">{{item.label}}</list-item>
            </obi-list>
        </float-container>`,
    options: {
        dataset: {
            valid: "",
        },
        storage: {
            search: "",
            timerSearch: 0,
        },
        inputs: ["opzioni", "label", "valore", "messaggio", "prepend", "append", "placeholder", "disabled", "icon"],
        computed: {
            selected: function () {
                if (!isNaN(parseFloat(this.valore))) this.valore = parseFloat(this.valore);
                let _selected = this.valore ? this.opzioni.find(e => e.value == this.valore) : null;
                return _selected ? _selected.label : "";
            },
            value() {
                return this.valore;
            },
            required: function () {
                return this.__element.getAttribute("required") != null;
            },
        },
        actions: {
            select(evt) {
                let _value = evt.currentTarget.getAttribute("value");
                let nan = isNaN(parseInt(_value));
                if (!nan) _value = parseInt(_value);
                let temp = _value ? _value : (nan ? "" : 0);
                if (temp != this.valore) {
                    this.valore = temp;
                    this.__node.trigger("changed", temp);
                }
            },
            checkText(evt) {
                let valore = this.opzioni.find(e => e.text === this.selected_text)
                if (valore == null) this.valore = 0; else this.valore = valore.value;
            },
            isValid() {
                return !this.required || this.required && this.valore > 0;
            },
            scrollSearch(evt) {
                clearTimeout(this.__storage.timerSearch);

                this.__storage.search += evt.key.toLowerCase();
                const options = this.__element.querySelectorAll("[list-item]");
                for (let option of options) {
                    if (option.textContent.trim().toLowerCase().startsWith(this.__storage.search)) {
                        option.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        break;
                    }
                }

                this.__storage.timerSearch = setTimeout(() => { this.__storage.search = ""; }, 500);
            }
        }
    }
}
);