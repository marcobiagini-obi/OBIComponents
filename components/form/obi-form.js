import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import Service from "../../LAMP/ServerModule/LampService.js";
import { obiAlert } from "../../core.js";
import { Log } from "../../LAMP/RenderModule/modules/console.js";

defineComponent({
    selector: "obi-form",
    template: `
    <form obi-form @submit='submitForm' display-column>
        <obi-card flex-size='auto'>
            <card-body>
                <slot name='inputForm'/>
            </card-body>
            <card-action>
                <obi-button cmd-if='showSaveButton' :relevance='relevance' :label='label' :prepend='icona' type='submit'></obi-button>
                <slot name='actions'></slot>
                <div style='flex-grow: 1'></div>
                <obi-button cmd-if='isRemovable' relevance='danger' label='Rimuovi' prepend='delete' @click='remove'></obi-button>
            </card-action>
        </obi-card>
    </form>`,
    options: {
        inputs: ["submit", "modello", "messaggio", "request", "label", "icona", "relevance"],
        dataset: {
            request: "POST",
            label: "Salva",
            icona: "save",
            relevance: "primary",
            edited: false,
        },
        storage: {
            editTimer: null,
        },
        computed: {
            isRemovable: function () { return this.__element.hasAttribute("removable") || this.__element.hasAttribute("enable-remove"); },
            isAutoSubmit: function () { return this.__element.hasAttribute("auto-submit"); },
            showSaveButton: function () { return this.isAutoSubmit ? this.edited : true; },
        },
        actions: {
            async submitForm(evt) {
                evt.preventDefault();
                if (evt.submitter.getAttribute("type") == "submit") await this.submitData();
            },
            async submitData() {
                if (this.validateInput()) {
                    this.__node.trigger("action", this.modello);
                    if (this.submit) {
                        let response = await Service.instance.upload(this.submit, JSON.stringify(this.modello), this.request)
                            .catch((ex) => { Log.error(ex); return ex; });
                        if (!response?.ok) { this.__node.trigger("submiterror", response.statusText ?? response); return; }
                        this.__element.querySelectorAll("[obi-textarea]")
                            .forEach(e => { try { e.virtual?.context.submitTrigger(); } catch (ex) { console.error(ex); } });
                        this.__node.trigger("submitsuccess", await response.json());
                        if (this.messaggio) obiAlert(this.messaggio, { type: 'success' });
                    }
                    this.edited = false;
                } else {
                    obiAlert("Controllare che tutti i campi siano correttamente compilati.", { type: "warning" });
                }
            },
            async remove(evt) {
                let response = null;
                let removeAction = this.__element.getAttribute("enable-remove");
                if (removeAction) response = await Service.instance.delete(removeAction).catch((ex) => obiAlert(ex.message, { type: "error" }));
                this.__node.trigger("remove", response ?? evt);
            },
            getformData: function () { return new FormData(this.__element); },
            validateInput: function () {
                var uncheckable = " [obi-select], [obi-checkgroup], [obi-combobox], [obi-date], [obi-file], [obi-slider], [obi-textarea], [obi-textbox], [obi-time]";
                var inputs = Array.from(this.__element.querySelectorAll(uncheckable));
                return inputs.find(e => {
                    let virtual = e.virtual;
                    if ("isValid" in virtual.context) return !virtual.context.isValid();
                    if (virtual.parent && "isValid" in virtual.parent.context) return !virtual.parent.context.isValid();
                    return false;
                }) == null;
            },
            onEdit() {
                this.edited = true;
                clearTimeout(this.__storage.editTimer);
                this.__storage.editTimer = setTimeout(() => {
                    this.submitData();
                }, 1000);
            }
        },
        events: [],
    }
});