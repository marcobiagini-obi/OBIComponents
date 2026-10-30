import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";
import { sendEmailToAssistenza } from "../../src/support.js";
import { obiAlert } from "../../core.js";

const loginKeywords = {
    portale: "portale",
    action: "action",
    message: "message",
}

defineComponent({
    selector: "obi-login",
    template:
        `<div obi-login>
            <div login-form>
                <obi-cover :link='image'></obi-cover>
                <obi-card :titolo='"Accedi a " + $.portale'>
                    <card-body>
                        <form margin-side='lg'>
                            <obi-textbox name='username' :valore="username" label="Username" prepend='<obi-icon nome="person"></obi-icon>' @keyup='loginShortcut'></obi-textbox>
                            <obi-textbox name='password' :valore="password" label="Password" type="password" prepend='<obi-icon nome="key"></obi-icon>' @keyup='loginShortcut'></obi-textbox>
                        </form>
                    </card-body>
                    <card-action>
                        <obi-button name='login' label='login' append='login' relevance="primary" @click="loginTrigger"></obi-button>
                        <obi-button label='Richiedi Accesso' prepend='badge' relevance="secondary" @click="signIn"></obi-button>
                    </card-action>
                <obi-card>
            </div>
            <obi-modal focus>
                <obi-card titolo="Richiedi l'accesso ai servizi OBI">
                    <card-body display-grid='blog'>
                        <div grid-quote>
                            <div display-row='wrap'>
                                <obi-textbox flex-size='auto' label='Nome' :valore='modello.nome' required variant='filled'></obi-textbox>
                                <obi-textbox flex-size='auto' label='Cognome' :valore='modello.cognome' required variant='filled'></obi-textbox>
                                <obi-textbox flex-size='auto' label='Negozio' :valore='modello.negozio' type="number" variant='filled'></obi-textbox>
                            </div>
                            <obi-textarea label='Dettaglio Richiesta' variant='filled' :valore='modello.note'></obi-textarea>
                        </div>
                    </card-body>
                    <card-action>
                        <obi-button label='Invia richiesta' variant='filled' prepend='email' @click='inviaRichiesta'></obi-button>
                    </card-action>
                </obi-card>
            </obi-modal>
        </div>`,
    options: {
        inputs: ["portale", "fastlogin"],
        dataset: {
            portale: new URLSearchParams(window.location.search).get(loginKeywords.portale) || "Servizi OBI",
            username: "",
            password: "",
            image: "${BASE_URL}/resources/images/backgroundOBI.jpg",
            modello: {
                nome: "",
                cognome: "",
                negozio: 0,
                note: "",
            }
        },
        computed: {
            modal: function () { return this.__node.getChildContext("obi-modal"); },
        },
        actions: {
            loginTrigger: function () {
                if (this.username && this.password) {
                    this.__node.trigger("login", { username: this.username, password: this.password });
                    let url = new URLSearchParams(window.location.search);
                    if (this.portale && url.has(loginKeywords.action)) {
                        let action = url.get(loginKeywords.action);
                        let url = new URL(window.location);
                        url.pathname = `/${this.portale}/${action}?username=${username}&password=${password}`;
                        url.href;
                    }
                } else {
                    obiAlert("Inserire un nome utente ed una password validi per poter effettuare l'accesso", { type: 'warning' });
                }
            },
            loginShortcut: function (evt) {
                let name = evt.currentTarget.getAttribute("name");
                let _keycode = evt.which || evt.keyCode || event.charCode;

                if (_keycode === 13) {
                    if (name == "username" && !this.password) {
                        let password = evt.currentTarget.nextElementSibling?.querySelector("input");
                        if (password) password.focus();
                        return;
                    }
                    this.loginTrigger();
                }
            },
            signIn() {
                this.modal.open();
            },
            inviaRichiesta() {
                if (this.modello.nome && this.modello.cognome) {
                    try {
                        let subject = "Richiesta Dati di Accesso ai Servizi OBI";
                        let corpo = `l'utente ${this.modello.nome} ${this.modello.cognome} richiede un intervento sui dati di accesso ${this.portale != "Servizi OBI" ? `per il portale ${this.portale}` : "."}
                        
                        ${this.modello.negozio ? `Negozio di riferimento: ${this.modello.negozio},` : ""}
                        Richiesta:

                        ${this.modello.note}`;
                        sendEmailToAssistenza(subject, corpo);
                    } catch (ex) {
                        obiAlert("Non è stato possibile inviare l'email", { type: "error" }, { source: "Login", message: ex });
                    }
                    this.modello = {
                        nome: "",
                        cognome: "",
                        negozio: 0,
                        note: "",
                    }
                    this.modal.close();
                } else {
                    obiAlert("Inserire il proprio Nome e Cognome per poter inviare la richiesta", { type: "warning" });
                }
            },
            onLoginError(ex) {
                const me = this;
                let error = Array.isArray(ex) ? ex[0] : ex;
                const message = error.cause?.message ?? error.message ?? "Si è verificato un errore sconosciuto durante il login";
                obiAlert(message, {
                    type: "error",
                    actions: [
                        {
                            name: "Assistenza",
                            action: function () {
                                me.modello.note = `Errore durante l'accesso: ${message}`;
                                me.modal.open();
                            },
                            timer: 10000
                        }
                    ]
                });
            }
        },
        events: [
            {
                name: Collection.node_event.progress,
                action(state) {
                    if (state == Collection.lifecycle.mounted) {
                        let url = new URLSearchParams(window.location.search);
                        if (this.fastlogin && typeof this.fastlogin == "object" && "username" in this.fastlogin && "password" in this.fastlogin) {
                            this.username = this.fastlogin.username;
                            this.password = this.fastlogin.password;
                            this.loginTrigger();
                        }
                        if (url.has(loginKeywords.message)) obiAlert(url.get(loginKeywords.message));
                    }
                }
            }
        ],
    }
});

defineComponent({
    selector: "obi-login-component",
    template: `<test-template name='OBI LOGIN' :description='note' :code='template' just-code></test-template>`,
    options: {
        dataset: {
            note: `Il componente di Login è progettato per funzionare come una Applicazione all'interno dell'applicazione.

Come si può notare nell'esempio tramite questo componente è possibile gestire il login tramite eventi.

@login -> permette di catturare il click sul tasto accedi, l'evento trasmette tramite attributo un oggetto di tipo { username: string, password: string }
Il click sul tasto accedi esegue un controllo sulla validità dei campi prima di trasmettere l'evento

Questo componente presenta due input:
- portale: string => permette di specificare il nome del portale al quale si sta accedendo.
- fastlogin: { username: string, password: string } => permette di eseguire un login automatico al caricamento della pagina.

Sono anche supportati tre keywords tra i parametri url:
- portale => permette di specificare il nome del portale al quale si sta accedendo
- action => insieme al parametro url portale permette di eseguire un reindirizzamento ad una action specifica click su accedi
La action viene costruita secondo la struttura :host/portale/action?username={{this.username}}&password={{this.password}}
- message => permette di stampare un messaggio al caricamento della pagina.
`,
            template:
                `<obi-login id='loginApp' @login='accedi'></obi-login>

<script type='module'>
    import RenderEngine from "${BASE_URL}/LAMP/RenderModule/LampRender.js";
    import Service from "${BASE_URL}/LAMP/ServerModule/LampService.js";
    import UserHandler from "${BASE_URL}/LAMP/UserModule/LampAccess.js";
    import { obiAlert } from "${BASE_URL}/core.js";
    
    RenderEngine.instance.start("loginApp").build({
        dataset: {
            urlLogin: "Login/AzioneLogin",
            urlHome: "Home/AzioneHome",
        },
        actions:{
            accedi: function(username, password){
                if (username && password) {
                    Service.instance.getJson(this.urlLogin + \`?username=\${username}&password=\${password}\`).then((response) => {
                        if(response isnot error){
                            UserHandler.instance.login(username, response);
                            location.replace(urlHome);
                        }else{
                            obiAlert(response.Message, { type: "warning" });
                        }
                    }).catch(async (exception) => {
                        obiAlert(await exception.text(), { type: "error" });
                    });
                }else{
                    obiAlert("Inserire i dati di accesso", { type: "warning" });
                }
            }
        }
    });

</scr`+ `ipt>`,
        }
    }
})