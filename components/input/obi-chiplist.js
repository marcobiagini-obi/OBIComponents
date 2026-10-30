import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";
import { checkHtmlWhitelist } from "../../src/support.js";
import { checkValue } from "./obi-textbox.js";

const selectAllKey = "_SELECT_ALL_";

defineComponent(
    {
        selector: "obi-chiplist",
        template:
            `<float-container obi-chiplist :disabled="isDisabled">
            <div obi-textbox :disabled='isDisabled' :required='required' :invalid='isInvalid'>
                <div text-input gap='sm' padding='xs' @click='updateSelectOptions' float-toggle>
                    <obi-chip cmd-if='$.stamp.length > 5' relevance='danger' label='Rimuovi' prepend='clear_all' interactable :disabled="isDisabled" @click='removeAll'></obi-chip>
                    <obi-chip relevance='neutral' cmd-for='item in stamp' :label='$.item?.label ?? $.item' prepend='close' interactable :disabled="isDisabled"
                    @click='removeValue' :data-index=':index' style='min-width: fit-content'></obi-chip>
                    <div contenteditable='true' cmd-model='inputValue' @input='triggerChange' @keydown='triggerChange'
                        class='new-line' :disabled='isDisabled' :empty='isEmpty'></div>
                    <span cmd-if='!$.valore' placeholder>{{placeholder}}</span>
                    <label for='input' cmd-if='label'>{{label}}</label> 
                    <div text-indicator></div>
                </div> 
                <div text-support> 
                    <span message cmd-if='$.messaggio' class='txt-body2'>{{messaggio}}</span> 
                    <span counter cmd-if='$.counter'>{{counter}}</span> 
                </div> 
            </div>
            <obi-list cmd-if='$.selectOptions?.length' floating-item interact variant='elevated'>
                <list-item float-toggle cmd-for='item in selectOptions' :value='$.item.value' @click='select' cmd-filter='$.value ? true : item?.label.toLowerCase().includes($.selected_text?.toLowerCase())'>{{item.label}}</list-item>
            </obi-list>`,
        options: {
            inputs: ["label", "valore", "opzioni", "messaggio", "placeholder", "separatore", "format"],
            dataset: {
                type: "text",
                separatore: ",",
                inputValue: "",
                selected_text: "",
                stamp: [],
                selectOptions: [],
                invalid: false,
                opzioni: [],
            },
            storage: {
                inputTimeout: null,
            },
            computed: {
                value: function () {
                    let output = this.getValue();
                    if (this.inputValue) {
                        if (Array.isArray(output)) output.push(this.inputValue);
                        else output += `${this.separatore}${this.inputValue}`;
                    }
                    return output;
                },
                content: function () {
                    return !this.value ? this.valore == this.placeholder || "" : "";
                },
                required: function () {
                    return this.__element.getAttribute("required") != null;
                },
                isEmpty: function () { return this.value == null || this.value == ""; },
                isInvalid: function () { return !this.isValid(); },
                isSingleSelect: function () {
                    return this.__node.reference[0]?.getAttribute("select-mode") == "single";
                },
                isDisabled: function () { return this.__element?.getAttribute("disabled") != null; },
                selectAllOptions: function () { return this.__element?.getAttribute("not-select-all") == null; }
            },
            actions: {
                updateSelectOptions(evt) {
                    if (!Array.isArray(this.opzioni) || !this.opzioni?.length) return;
                    if (this.isSingleSelect) {
                        this.selectOptions = this.opzioni.filter(item => {
                            return !this.valore.includes(item.value ?? item.label ?? item);
                        });
                    } else {
                        this.selectOptions = Array.from(this.opzioni);
                    }
                    if (Array.isArray(this.selectOptions) && this.selectOptions.length > 0 && !this.selectAllOptions) {
                        this.selectOptions.unshift({ label: "Seleziona tutto", value: selectAllKey });
                    }
                },
                triggerChange(evt) {

                    this.isValid();

                    if (this.__storage.inputTimeout) clearTimeout(this.__storage.inputTimeout);

                    let cont = this.separatore == " " ? this.inputValue.toString() : this.inputValue.toString().trim();

                    const normalize = str => (str?.toString() ?? "").toLowerCase();
                    const findOption = val =>
                        this.opzioni?.find(item =>
                            typeof item === "object" && item !== null && "label" in item && "value" in item
                                ? (item?.label != null && (normalize(item.label) === normalize(val))) ||
                                (item?.value != null && (normalize(item.value) === normalize(val)))
                                : typeof item == "string" ? normalize(item) === normalize(val) : item == val
                        );

                    // Handle exact match with option
                    let option = findOption(cont);
                    if (option) {
                        this.__storage.inputTimeout = setTimeout(() => {
                            this.stamp.push(option);
                            this.inputValue = "";
                            this.valore = this.getValue();
                            this.__node.trigger("changed", this.value);
                            this.__storage.inputTimeout = null;
                        }, 500);
                        return;
                    }

                    // Handle Enter key or insertParagraph
                    if ((evt && evt.inputType === "insertParagraph") || evt?.key === "Enter") {
                        evt.preventDefault?.();
                        let option = findOption(cont);
                        this.stamp.push(option || { label: cont, value: cont });
                        this.inputValue = "";
                        this.valore = this.getValue();
                        this.__node.trigger("changed", this.value);
                        return;
                    }

                    // Handle Backspace key
                    // Remove the last item if Backspace is pressed and inputValue is empty
                    if (evt?.key === "Backspace" && this.inputValue === "") {
                        this.stamp.pop();
                        this.valore = this.getValue();
                        this.__node.trigger("changed", this.value);
                        return;
                    }

                    // Handle multiple values separated by separatore
                    let slots = cont.split(this.separatore).map(s => s.trim()).filter(Boolean);
                    if (cont.includes(this.separatore) && slots.length > 0) {
                        for (const slot of slots) {
                            let opt = findOption(slot);
                            this.stamp.push(opt || { label: slot, value: slot });
                        }
                        this.inputValue = "";
                        this.valore = this.getValue();
                        this.__node.trigger("changed", this.value);
                    }
                    this.scrollSearch(evt);
                },
                select(evt) {
                    const value = evt.currentTarget.getAttribute("value");

                    if (value === selectAllKey) {
                        this.stamp = Array.isArray(this.opzioni)
                            ? this.opzioni.map(item => item)
                            : [];
                        this.valore = this.getValue();
                        this.__node.trigger("changed", this.value);
                        return;
                    }
                    this.inputValue = evt.currentTarget.innerText + this.separatore;
                    this.triggerChange(evt);
                },
                syncValue() {
                    this.stamp = [];
                    if (Array.isArray(this.valore)) {
                        for (const val of this.valore) {
                            let _option = this.opzioni?.find(e => e.value == val);
                            if (_option) {
                                this.stamp.push(_option);
                            } else {
                                this.stamp.push({ label: val, value: val });
                            }
                        }
                        return;
                    }
                    if (typeof this.valore == "string") {
                        let _val = this.valore.split(this.separatore).map(s => s.trim()).filter(Boolean);
                        for (const val of _val) {
                            let _option = this.opzioni?.find(e => e.value == val);
                            if (_option) {
                                this.stamp.push(_option);
                            } else {
                                this.stamp.push({ label: val, value: val });
                            }
                        }
                    }
                },
                removeValue(evt) {
                    let _value = evt.currentTarget?.getAttribute("data-index");
                    if (_value == null) return;
                    this.stamp.splice(Number(_value), 1);
                    this.valore = this.getValue();
                    this.__node.trigger("changed", this.value);
                },
                removeAll() {
                    this.stamp = [];
                    this.valore = [];
                    this.__node.trigger("changed", this.value);
                },
                scrollSearch(evt) {
                    const options = Array.from(this.__element.querySelectorAll("[list-item]"));
                    let option = options.find(e => e.innerText.trim().toLowerCase().includes(this.inputValue.toLowerCase()));
                    if (option) {
                        option.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        const input = this.inputValue.trim().toLowerCase();
                        if (input)
                            option.innerHTML = option.innerHTML.replace(new RegExp(`(${input})`, "gi"), "<mark>$1</mark>");
                    }
                },
                update() {
                    this.syncValue();
                    this.updateSelectOptions();
                },
                isValid() {
                    if (this.invalid) return false;
                    if (this.required && this.isEmpty) return false;
                    if (this.value != null) {
                        if (!checkHtmlWhitelist(this.value, ['STRONG', 'EM', 'U', 'S', 'DIV', 'P', '#text', 'SPAN'])) return false;
                        if (this.count && this.value.length > this.count) return false;
                    }
                    return true;
                },
                getValue() {
                    let output = Array.from(this.stamp.map(item => item?.value ?? item?.label ?? item));
                    return Array.isArray(this.valore) ? output : output.join(this.separatore);
                },
            },
            events: [
                {
                    name: "progress",
                    action: function (state) {
                        switch (state) {
                            case "mounted":
                                this.update();
                                break;
                        }
                    },
                },
                {
                    name: "changed",
                    action: function () {
                        this.updateSelectOptions();
                    }
                }
            ]
        }
    }
);