import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import UserHandler from "../../LAMP/UserModule/LampAccess.js";
import Service from "../../LAMP/ServerModule/LampService.js";
import Appunto from "../../src/models/Appunto.js";
import { asyncDataLoader } from "../../core.js";

defineComponent({
    selector: "obi-note",
    template: `<div obi-card='note' :relevance='colore' style='overflow: visible;'>            
        <obi-textarea righe='5' @keydown='submit' @changed='onInputEvent' placeholder='Inserisci una nota...' :disabled='!$.isAuthor' style='flex-grow: 1' enable-format></obi-textarea>
        <div :hidden='$.appunto.id === 0' display-row padding-side="sm">
            <obi-logo cmd-if='$.profilo != ""' size='xs' :src='profilo' style='margin-right: 4px;'></obi-logo>
            <obi-icon cmd-else size='xs' nome='person' style='margin-right: 4px;' variant='outlined'></obi-icon>
            <obi-label flex-size='unset' size='sm' :valore='$.appunto?.nome'></obi-label>
            <span flex-size='auto'></span>
            <obi-label flex-size='unset' size='xs' :label='stampTimeStamp'></obi-label>
            <float-container>
                <obi-button :hidden='!$.isAuthor' float-toggle size='xs' padding='none'><obi-icon nome='more_vert'></obi-icon></obi-button>
                <div floating-item interact variant='elevated'>
                    <slot name='options'></slot>
                </div>
            </float-container>
        </div>
        <obi-title :hidden='$.appunto.id > 0' descrizione='shift + invio per salvare' size='xs' padding-side="sm"></obi-title>
    </div>`,
    options: {
        inputs: ["appunto", "colore", "profilo", "action"],
        dataset: {
            appunto: new Appunto(),
            colore: "warning",
            profilo: "",
        },
        storage: {
            __editorTimer: null,
            __editorTimeout: 2000,
        },
        computed: {
            currentUser: function () {
                return UserHandler.instance.user;
            },
            stampTimeStamp: function () {
                let timeStamp = this.appunto?.timeStamp ? new Date(this.appunto.timeStamp) : new Date();
                const day = String(timeStamp.getDate()).padStart(2, '0');
                const month = String(timeStamp.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                const year = String(timeStamp.getFullYear()).slice(-2); // Get last two digits of the year
                return `<span style='white-space: nowrap' font-type='caption'>${day}-${month}-${year}</span>`;
            },
            isAuthor: function () { return this.appunto?.id == 0 || this.currentUser?.id === this.appunto.idOwner },
            inputElement: function () { return this.__node.getChildContext("obi-textarea"); }
        },
        actions: {
            async insert() {
                let value = this.inputElement.valore;
                var response = { ...this.appunto, note: value };
                if (this.action) {
                    let requestOutput = await Service.instance.post(`${this.action}`, this.appunto);
                    if (requestOutput) response = requestOutput;
                }
                this.appunto = new Appunto(); this.syncValue();
                this.__node.trigger("created", new Appunto(response));
            },
            async update() {
                if (this.action) {
                    if (this.__storage.__editorTimer) clearTimeout(this.__storage.__editorTimer);
                    this.__storage.__editorTimer = setTimeout(async () => {
                        let response = await Service.instance.put(`${this.action}/${this.appunto.id}`, this.appunto).catch(ex => {
                            console.error(ex);
                            obiAlert("Non è stato possibile aggiornare la nota", { type: "error" }, ex);
                            return ex;
                        });
                        if (response?.ok) {
                            const data = await response.json();
                            this.__node.trigger("submitted", new Appunto(data));
                        }
                    }, this.__storage.__editorTimeout);
                }
                this.__node.trigger("updated", { ...this.appunto, note: this.inputElement.valore });
            },
            async delete() {
                if (this.action) await Service.instance.delete(`${this.action}/${this.appunto.id}`);
                this.__node.trigger("deleted", this.appunto);
            },
            async onInputEvent() {
                if (this.appunto.id > 0) {
                    const element = this.__element.querySelector("div[contenteditable]");
                    if (element.textContent.replace(/\n/g, "").length === 0)
                        await this.delete();
                    else
                        await this.update();
                    return; // Prevent immediate trigger below
                }
            },
            async submit(evt) {
                const isEnter = evt.key === "Enter";
                const isShift = evt.shiftKey;
                if (isEnter && isShift) {
                    await this.insert();
                    evt.preventDefault(); // Blocca tutto tranne Shift+Enter
                    return;
                }
            },
            setup(input) {
                this.appunto = new Appunto(input);
                this.colore = this.appunto?.colore ?? "warning";
                this.profilo = this.appunto?.profilo ?? "";
            },
            syncValue() {
                this.__node.getChildContext("obi-textarea").valore = this.appunto.note
            }
        },
        events: [
            asyncDataLoader.call(this, function () {
                if (this.appunto.id > 0) this.syncValue();
            }),
        ]
    }
});