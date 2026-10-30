import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";
import { checkHtmlWhitelist } from "../../src/support.js";

defineComponent({
	selector: "obi-textbox",
	template: `<div obi-textbox :disabled='disabled'>
	    <div text-input>
		    <div cmd-if='$.prepend != null && $.prepend != ""' prepend>{{prepend}}</div> 
		    <input :type='type' cmd-model='valore'
				:placeholder='placeholder' :disabled="disabled" :empty='isEmpty'
				@change='changedValue' @keyup='formatValue' @keydown='keyTrigger'
				:max='max' :min='min' :required='required' :invalid='isInvalid' :pattern='pattern' />
		    <label for='input' cmd-if='$.label'>{{label}}</label> 
		    <div cmd-if='$.append != null && $.append != ""' append>{{append}}</div>
		    <div text-indicator></div>
	    </div> 
	    <div text-support>
		    <span message cmd-if='$.messaggio' class='txt-body2'>{{messaggio}}</span> 
		    <span counter cmd-if='$.counter'>{{counter}}</span> 
	    </div> 
    </div>`,
	options: {
		dataset: {
			valore: "",
			type: "text",
			invalid: false,
		},
		inputs: ["label", "valore", "messaggio", "prepend", "append", "placeholder", "type", "filter", "pattern", "format", "max", "min", "count", "disabled", "invalid"],
		computed: {
			value: function () {
				let _reference = this.__node.reference[0];
				if (_reference) {
					let _input = _reference.querySelector("input");
					let _value = _input && "value" in _input ? _input.value : null;
					if (_value && !isNaN(Number(_value))) _value = Number(_value);
					return _value;
				}
				return null;
			},
			counter: function () {
				return this.count ? `${this.valore.toString().length}/${this.count}` : null;
			},
			isInvalid: function () { return !this.isValid() },
			isEmpty: function () {
				return this.valore == null || this.valore == "";
			},
			required: function () {
				return this.__element.getAttribute("required") != null;
			},
		},
		actions: {
			changedValue() {
				if (this.type == "prenotazione") this.valore = formatPrenotazione(this.value.toString(), "52");
				if (this.type == "offerta") this.valore = formatPrenotazione(this.value.toString(), "51");

				this.__node.trigger("change", this.value);
				this.__node.trigger("changed", this.value);

				function formatPrenotazione(value, prefix) {
					if (!value) return value;
					value = String(value);
					if (value.startsWith(prefix) && value.length === prefix.length + 9) return value;
					return prefix + value.padStart(9, "0");
				}
			},
			formatValue(evt) {
				if (this.format != null && this.format != "currency") {
					let i = 0;
					let k = 0;
					let j = 0;
					let _clean_value = "";
					var _formatted_value = "";
					while (i < this.format.length && i < this.valore.length) {
						if (this.format.charAt(i) == "#" || this.valore.charAt(i) != this.format.charAt(i)) _clean_value += this.valore.charAt(i);
						i++;
					}
					if (this.filter && this.filter instanceof RegExp) _clean_value = _clean_value.replace(this.filter, "");
					while (k < _clean_value.length && j < this.format.length) {
						if (this.format.charAt(j) == "#") {
							_formatted_value += _clean_value.charAt(k);
							k++;
						} else {
							_formatted_value += this.format.charAt(j);
						}
						j++;
					}

					this.valore = _formatted_value;
					this.__node.trigger("keyup", evt, this.value);
				}
			},
			keyTrigger(evt) {
				this.__node.trigger("keydown", evt);
			},
			isValid() {
				if (this.invalid) return false;
				if (this.value != null) {
					if (this.count && this.value.toString().length > this.count) return false;
					return checkValue(this.__element.getAttribute("format"), this.value);
				}
				return null;
			}
		}
	}
});

export function checkValue(check, value) {
	if (!checkHtmlWhitelist(value, ['STRONG', 'EM', 'U', 'S', 'DIV', 'P', '#text'])) return false;
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

defineComponent({
	selector: "obi-textbox-component",
	template:
		`<test-template name='OBI TEXTBOX' description='Casella di input testuale' :code='code'>
            <section actions slot='actions'>
                <obi-select :valore='type' label='Tipo' :opzioni='tipi'></obi-select>
                <obi-select :valore='variante' label='Variante' :opzioni='varianti'></obi-select>
                <obi-select :valore='pattern' label='Format' :opzioni='patterns'></obi-select>
                <obi-textbox type='number' :valore='count' label='Count'></obi-textbox>
                <obi-checkbox label='Placeholder' :valore='placeholder' button></obi-checkbox>
                <obi-checkbox label='Richiesto' :valore='required' button></obi-checkbox>
                <obi-checkbox label='Disabilita' :valore='disabled' button></obi-checkbox>
                <obi-checkbox label='Prepend' :valore='prepend' button></obi-checkbox>
                <obi-checkbox label='Append' :valore='append' button></obi-checkbox>
                <obi-checkbox label='Group' :valore='group' button></obi-checkbox>
                <obi-checkbox label='Multilinea' :valore='multiline' button></obi-checkbox>
            </section>
        </test-template>`,
	options: {
		dataset: {
			variante: "",
			varianti: [
				{ label: "standard", value: "" },
				{ label: "filled", value: "filled" },
				{ label: "outlined", value: "outlined" }
			],
			disabled: false,
			placeholder: false,
			type: "",
			tipi: [
				{ label: "text", value: "" },
				{ label: "number", value: "number" },
				{ label: "password", value: "password" },
			],
			patterns: [
				{ label: "Nessun Pattern", value: "" },
				{ label: "Telefono", value: "###-###-####" },
				{ label: "Data", value: "##/##/####" },
			],
			format: "",
			prepend: false,
			append: false,
			required: false,
			group: false,
			count: 0,
			multiline: false,
		},
		computed: {
			code: function () {

				let _variant = this.variante ? " variant='" + this.variante + "'" : "";
				let _disabled = this.disabled ? " disabled" : "";
				let _placeholder = this.placeholder ? " placeholder='Placeholder'" : "";
				let _label = !this.placeholder ? " label='label'" : "";
				let _type = this.type ? " type='" + this.type + "'" : "";
				let _format = this.format ? " format='" + this.format + "'" : "";
				let _message = this.format ? " messaggio='" + this.format + "'" : "";
				let _prepend = this.prepend ? " prepend='+39'" : "";
				let _append = this.append ? " append='€'" : "";
				let _required = this.required ? " required" : "";
				let _count = this.count ? " count='" + this.count + "'" : "";

				return this.multiline ? "<obi-textarea></obi-textarea>" : this.group ? `<group-component>
	<obi-textbox ` + _label + _variant + _disabled + _placeholder + _type + _format + _prepend + _append + _message + _required + _count + `></obi-textbox>
	<obi-textbox ` + _label + _variant + _disabled + _placeholder + _type + _format + _prepend + _append + _message + _required + _count + `></obi-textbox>
	<obi-button variant='filled'><obi-icon nome="search"></obi-icon></obi-button>
</group-component>` :
					"<obi-textbox " + _label + _variant + _disabled + _placeholder + _type + _format + _prepend + _append + _message + _required + _count + "></obi-textbox>"
			}
		},
		actions: {
			toggle: function (field) {
				this[field] = !this[field];
			}
		},
	}
});