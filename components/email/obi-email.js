import { obiAlert } from "../../core.js";
import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import Service from "../../LAMP/ServerModule/LampService.js";
import EmailRequest from "../../src/models/EmailRequest.js";

defineComponent({
    selector: "obi-email",
    template: `<div obi-email>
        <card-body gap='sm'>
            <div display-row>
                <obi-chiplist name='receivers'flex-size='auto' label='Destinatari' :opzioni='rubrica' :valore='receivers' separatore=';' select-mode='single'></obi-chiplist>
                <obi-checkbox label='CC' :valore='copyForm' button></obi-checkbox>
            </div>
            <obi-chiplist cmd-if='copyForm' name='cc' label='CC' :opzioni='rubrica' :valore='email.header.copy' separatore=';' select-mode='single'></obi-chiplist>
            <obi-chiplist cmd-if='copyForm' name='blind' label='BCC' :opzioni='rubrica' :valore='email.header.blind' separatore=';' select-mode='single'></obi-chiplist>
            <obi-textbox label='Oggetto' :valore='email.header.subject'></obi-textbox>
            <obi-textarea placeholder='Inserisci un messaggio' :valore='body' righe='10'></obi-textarea>
        </card-body>
        <card-action>
            <obi-button label='Invia' prepend='email' relevance='primary' @click='send'></obi-button>
        </card-action>
    </div>`,
    options: {
        inputs: ["email", "rubrica", "action"],
        dataset: {
            copyForm: false,
            email: new EmailRequest(),
            rubrica: [],
            body: "",
            receivers: [],
            copy: [],
            blind: [],
        },
        actions: {
            async send() {
                this.updateContent();
                if (!this.validate()) return;
                if (this.action) {
                    let response = await Service.instance.put(this.action, this.email).catch(ex => { console.error(ex); obiAlert("Errore durante l'invio dell'email.", { type: "error" }); });
                    if (!response?.ok) { obiAlert("Errore durante l'invio dell'email.", { type: "error" }); return; }
                    this.resetForm();
                }
                this.__node.trigger("send", new EmailRequest(this.email));
            },
            validate() {
                if (!this.email.header.receiver || this.email.header.receiver.trim() === "") {
                    obiAlert("Inserire almeno un destinatario.", { type: "warning" });
                    return false;
                }
                if (!this.email.header.subject || this.email.header.subject.trim() === "") {
                    obiAlert("Inserire un oggetto.", { type: "warning" });
                    return false;
                }
                if (!this.email.content || this.email.content.length === 0 || this.email.content.every(line => line.trim() === "")) {
                    obiAlert("Inserire un messaggio.", { type: "warning" });
                    return false;
                }
                return true;
            },
            updateContent() {
                this.email.content = this.body.split("\n").map(line => line.trim()).filter(line => line.length > 0);
                this.email.header.receiver = this.receivers.join(";").trim();
                this.email.header.copy = this.copy.join(";").trim();
                this.email.header.blind = this.blind.join(";").trim();
            },
            resetForm() {
                this.email = new EmailRequest();
                this.body = "";
                this.copyForm = false;
            },
            syncForm() {
                this.receivers = this.email.header.receiver ? this.email.header.receiver.split(";").map(addr => addr.trim()) : [];
                this.__node.getChildContext("obi-chiplist[name='receivers']")?.syncValue();
                this.copy = this.email.header.copy ? this.email.header.copy.split(";").map(addr => addr.trim()) : [];
                this.__node.getChildContext("obi-chiplist[name='cc']")?.syncValue();
                this.blind = this.email.header.blind ? this.email.header.blind.split(";").map(addr => addr.trim()) : [];
                this.__node.getChildContext("obi-chiplist[name='blind']")?.syncValue();
                this.body = this.email.content ? this.email.content.join("\n") : "";
            },
            setup(email, rubrica) {
                this.email = new EmailRequest(email);
                if (rubrica) this.rubrica = rubrica;
                this.syncForm();
            }
        },
        events: [
            {
                name: "progress",
                action: function (state) {
                    switch (state) {
                        case "mounted":
                            this.syncForm();
                            break;
                    }
                },
            },
        ]
    }
});