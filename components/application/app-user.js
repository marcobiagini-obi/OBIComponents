import UserHandler from "../../LAMP/UserModule/LampAccess.js";
import Service from "../../LAMP/ServerModule/LampService.js";
import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { clickRippleEvent } from "../../src/support.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";
import { obiAlert, loadApi, isLocal, handleAPIError } from "../../core.js";
import { API_URL, BASE_URL } from "../../obi.config.js";

const keyStore = "ActiveStore";
const defaultActionLogin = `${window.location.protocol}//${window.location.host}/${window.location.pathname.split("/")[1]}/Accesso/Login`;
const hubapi = `${API_URL}/obihub/api`;

/**
 * Imposta lo scope dei modelli in base all'host (locale o di produzione)
 *
 * @param {*} action
 */
async function setModelsScope(action) {
    const isServerHost = !isLocal();

    let Utente, Progetto, Sessione;

    if (isServerHost) {
        Utente = await import(`${API_URL}/obihub/Scripts/Models/utente.model.js`).then((module) => module.default);
        Progetto = await import(`${API_URL}/obihub/Scripts/Models/progetto.model.js`).then((module) => module.default);
        Sessione = await import(`${API_URL}/obihub/Scripts/Models/sessione.model.js`).then((module) => module.default);
    } else {
        Utente = await import("../../src/models/LocalHostBackup.js").then((module) => module.Utente);
        Progetto = await import("../../src/models/LocalHostBackup.js").then((module) => module.Progetto);
        Sessione = await import("../../src/models/LocalHostBackup.js").then((module) => module.Sessione);
    }

    action(Utente, Progetto, Sessione);

}
/**
 * Restituisce il valore di un cookie specifico
 *
 * @param {*} name
 * @return {*} 
 */
function getCookieValue(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

defineComponent({
    selector: "app-user",
    template: `<float-container user-area>
        <a float-toggle tool-item @click='openLogin'>
            <obi-title :titolo='$.userIsLogged ?  $.utente.username : "Accedi"' :descrizione='nome_negozio' size='sm' interactable></obi-title>
            <obi-logo cmd-if='$.userIsLogged' :src='utente.profilo'></obi-logo>
            <obi-icon cmd-else nome='person' relevance='secondary' circle></obi-icon>
        </a>
        <obi-card user-details floating-item='bottom right' cmd-if='userIsLogged'>
            <obi-cover cmd-if='$.utente && ($.utente?.nome || $.utente?.cognome)' :titolo='$.utente?.nome + \" \" + $.utente?.cognome' :link='season' size='md'></obi-cover>
            <obi-cover cmd-else :titolo='utente?.username' :link='season' size='md'></obi-cover>
            <card-body>
                <div dettagli display-grid>
                    <obi-label grid-size='6' icona='mail' :title='"Email: " + $.utente?.email' :valore='utente.email'></obi-label>
                    <obi-label grid-size='6' cmd-if="$.utente?.ruolo" icona='badge' :title='"Ruolo: " + $.utente?.ruolo' :valore='utente.ruolo'></obi-label>
                    <obi-label grid-size='6' cmd-if="$.utente?.accesso" :icona='utente.iconaAccesso' :title='"Visibilita: " + $.utente?.accesso' :valore='utente.accesso'></obi-label>
                    <obi-label grid-size='6' cmd-if="$.utente?.note" icona='work' :title='"Altro: " + $.utente?.note' :valore='utente.note'></obi-label>
                </div>
                <div negozi cmd-if='$.utente?.negozi?.length > 0'>
                    <obi-headline label='NEGOZI'></obi-headline>
                    <section lista='negozi'>
                        <obi-chip cmd-for='neg in utente.negozi' @click='setNegozioAttivo' :relevance='$.neg.id == $.negozio ? "primary" : "neutral"' :value='neg.id' interactable>{{($.neg.codSap ? $.neg.codSap + ' ' : '') + $.neg.nome}}</obi-chip>
                    </section>
                </div>
                <div fornitori cmd-if='$.utente?.fornitori?.length > 0'>
                    <obi-headline label='FORNITORI'></obi-headline>
                    <section lista='fornitori'>
                        <obi-chip cmd-for='forn in utente.fornitori' interactable>{{forn.nome}}</obi-chip>
                    </section>
                </div>
            </card-body>
            <card-action>
                <obi-button prepend='logout' label='logout' @click='logout' variant='filled'></obi-button>
                <obi-button prepend='edit' label='Modifica' @click='openEditor' relevance='secondary'></obi-button>
            </card-action>
        </obi-card>
        <obi-modal name='loginForm' size='file'>
            <obi-card user-login>
                <obi-cover :titolo='Accedi al Portale' :link='season' size='md'></obi-cover>
                <card-body display-grid='blog'>
                    <obi-textbox grid-article label='username' :valore='__storage.loginUser.username' prepend='<obi-icon nome="person"></obi-icon>' @keyup='loginShortcut'></obi-textbox>
                    <obi-textbox grid-article type='password' label='Password' :valore='__storage.loginUser.password' prepend='<obi-icon nome="key"></obi-icon>' @keyup='loginShortcut'></obi-textbox>
                </card-body>
                <card-action>
                    <obi-button prepend='login' label='Accedi' @click='login' relevance='primary'></obi-button>
                </card-action>
            </obi-card>
        </obi-modal>
        <obi-modal name='userEditor'>
            <obi-card>
                <card-body display-grid='blog'>
                    <obi-label padding='sm' size='md' grid-quote flex-size='auto' label='Aggiorna i tuoi dati'></obi-label>
                    <div grid-article>
                        <div display-row='wrap'>
                            <obi-textbox name='nome' flex-size='auto' label='Nome' :valore='utente.nome' required variant='filled'></obi-textbox>
                            <obi-textbox name='cognome' flex-size='auto' label='Cognome' :valore='utente.cognome' required variant='filled'></obi-textbox>
                        </div>
                        <div display-row='wrap'>
                            <obi-textbox name='email' flex-size='auto' label='email' :valore='utente.email' type='email' required variant='filled'></obi-textbox>
                            <obi-textbox cmd-if='$.utente?.note' flex-size='auto' label='Altro' :valore='utente.note' variant='filled'></obi-textbox>
                        </div>
                        <div display-column padding='sm' relevance='secondary' rounded>
                            <obi-label size='sm'padding='sm' label='Modifica Password'></obi-label>
                            <obi-textbox type='password' name='currentPassword' margin-side='lg' label='Password Attuale' required variant='rounded'></obi-textbox>
                            <obi-textbox type='password' name='newPassword' margin-side='lg' label='Nuova Password' required variant='rounded'></obi-textbox>
                            <obi-textbox type='password' name='repeatPassword' margin-side='lg' label='Ripeti la Nuova Password' required variant='rounded'></obi-textbox>
                        </div>
                    </div>
                </card-body>
                <card-action>
                    <obi-button label='Aggiorna' relevance='success' append='save' @click='onEdit'></obi-button>
                </card-action>
            </obi-card>
        </obi-modal>
     </float-container>`,
    options: {
        inputs: ["utente", "progetto", "negozio", "messaggio", "action", "actionlogin"],
        dataset: {
            negozio: 0,
            password: { old: "", updated: "", repeat: "" },
            messaggio: "I dati dell'utente sono stati aggiornati con successo.",
            apis: {
                utenti: null,
                token: null,
            }
        },
        storage: {
            loginUser: { username: "", password: "" }
        },
        computed: {
            season: function () {
                var mm = new Date().getMonth() + 1;
                if (mm == 12 || (mm > 0 && mm < 3)) {
                    return `${BASE_URL}/resources/images/bg_winter_animated.gif`;
                }
                if (mm > 5 && mm < 9) {
                    return `${BASE_URL}/resources/images/bg_summer_animated.gif`;
                }
                if (mm > 8 && mm < 12) {
                    return `${BASE_URL}/resources/images/bg_autumn_animated.gif`;
                }
                if (mm > 2 && mm < 6) {
                    return `${BASE_URL}/resources/images/backgroundOBI_spring.jpg`;
                }
                return `${BASE_URL}/resources/images/backgroundOBI.jpg`;
            },
            nome_negozio: function () {
                if (this.negozio && this.utente?.negozi) {
                    let negozio = this.utente.negozi.find(n => n.id == this.negozio);
                    if (negozio) return `${negozio.codSap ?? ''} ${negozio.nome}`;
                }
                return null;
            },
            user_modal: function () { return this.__node.getChildContext("obi-modal[name='userEditor']"); },
            login_modal: function () { return this.__node.getChildContext("obi-modal[name='loginForm']"); },
            userIsLogged: function () { return this.utente?.id > 0 && UserHandler.instance.logged; },
            urlAction: function () { return this.action || `${hubapi}/utenti/${this.progetto}`; },
        },
        actions: {
            async login() {
                if (!this.actionlogin && this.apis.utente === null) {
                    obiAlert("Servizio non disponibile al momento, riprovare più tardi.", { type: "warning" });
                    return;
                }
                let username = this.__storage.loginUser.username;
                let password = this.__storage.loginUser.password;
                if (username && password) {
                    let response = this.actionlogin ?
                        await Service.instance.getJson(`${this.actionlogin}?username=${username}&password=${password}`)
                            .catch(ex => { handleAPIError(ex); return null; }) :
                        await this.apis.utenti.login({ username: username, password: password })
                            .catch(ex => { handleAPIError(ex); return null; });
                    if (response) {
                        this.onLogin(response);
                        this.__node.trigger("login", response);
                        this.login_modal?.close();
                        this.__app?.update();
                    }
                } else {
                    obiAlert("Inserire un nome utente ed una password validi per poter effettuare l'accesso", { type: 'warning' });
                }
            },
            async logout() {
                this.__storage.loginUser.username = "";
                this.__storage.loginUser.password = "";
                this.onLogout();
                this.__node.trigger("logout", this.utente);
                this.__app?.update();
            },
            async onEdit() {
                let confirm = await this.confirmPassword();
                if (!confirm) return;
                this.utente.password = this.__node.getChildContext("obi-textbox[name='newPassword']").value;
                let action = this.progetto ?
                    async () => { return await Service.instance.put(this.urlAction, { ...this.utente.toDBModel(), password: this.password.updated }); } :
                    async () => { return await Service.instance.post(this.urlAction, { ...this.utente.toDBModel(), password: this.password.updated }); };
                let res = await action().catch((error) => { obiAlert(error, { type: "server_error" }); });
                if (res?.ok) {
                    this.utente.password = this.password.updated;
                    obiAlert("Anagrafica aggiornata con successo", { type: "success" });
                    this.__node.trigger("edit", this.utente);
                    this.user_modal.close();
                } else { console.error(res.statusText); obiAlert("Non è stato possibile aggiornare i dati anagrafici", { type: "error" }); }
            },
            async confirmPassword() {
                return await checkPasswordEditing.call(this, this.utente,
                    this.__node.getChildContext("obi-textbox[name='currentPassword']"),
                    this.__node.getChildContext("obi-textbox[name='newPassword']"),
                    this.__node.getChildContext("obi-textbox[name='repeatPassword']")
                );
            },
            async onLogin(value) {
                await setModelsScope(async (Utente, Progetto, Sessione) => {
                    if (value && value.id) {
                        if (value instanceof Utente) this.utente = value; else this.utente = new Utente(value);
                        if (UserHandler.instance.user == null) UserHandler.instance.login(this.utente.username, this.utente);
                        //Impostazione del token
                        try {
                            if (!UserHandler.instance.user.token && this.apis.token !== null) {
                                var token = await this.apis.token.getStandardToken(this.utente.codice);
                                if (token) {
                                    UserHandler.instance.user.token = token
                                    UserHandler.instance.setSessionUser();
                                }
                            }
                        } catch (ex) { console.error(ex); }

                        if (this.progetto) {
                            if (UserHandler.instance.user.sessioni == null) UserHandler.instance.user.sessioni = [];
                            let currentSession = new Utente(UserHandler.instance.user).getSessione(this.progetto);
                            if (!currentSession) {
                                //scarico negozi dell'utente
                                let response = await Service.instance.get(`${hubapi}/utenti/${this.utente.id}/negozi/${this.progetto}`).catch(ex => console.error(ex));
                                if (!response?.ok) { obiAlert("Si è verificato un problema nella sincronizzazione dell'utente.", { type: "warning" }); this.utente.negozi = this.utente.negozi ?? []; }
                                else { this.utente.negozi = await response.json(); }
                                //Registro la sessione dell'utente
                                let sessione = new Sessione({
                                    id: getCookieValue('ASP.NET_SessionId'),
                                    progetto: Number(this.progetto),
                                    negozi: this.utente.negozi,
                                    betaAccess: this.utente.betaAccess,
                                    idRuolo: this.utente.idRuolo,
                                    note: this.utente.note,
                                    email: this.utente.email,
                                });
                                UserHandler.instance.user.sessioni.push(sessione);
                                UserHandler.instance.setSessionUser();
                                //registro ultimo accesso al portale
                                Service.instance.put(`${hubapi}/progetti/${this.progetto}/login/${this.utente.id}`).catch(ex => console.error(ex));
                            } else {
                                this.utente = new Utente({
                                    ...this.utente,
                                    negozi: currentSession.negozi,
                                    betaAccess: currentSession.betaAccess,
                                    idRuolo: currentSession.idRuolo,
                                    note: currentSession.note,
                                    email: currentSession.email,
                                });
                            }
                            //Reindirizzamento sulla versione Beta del portale
                            try {
                                let portale = new Progetto(await Service.instance.getJson(`${hubapi}/progetti/${this.progetto}`).catch(ex => { console.error(ex); return {}; }));
                                let isBeta = portale.installazioneBeta && location.href.toLowerCase().includes(portale.installazioneBeta.toLowerCase());
                                let isDev = portale.installazioneDev && location.href.toLowerCase().includes(portale.installazioneDev.toLowerCase());
                                if (!isBeta && !isDev && this.utente.betaAccess) {
                                    this.onLogout();
                                    if (portale.installazioneBeta) location.href = `${portale.installazioneBeta}/Accesso/HubLogin/${this.utente.codice}`;
                                }
                            } catch (ex) {
                                console.error(ex);
                            }
                        }
                        //Imposto il negozio attivo
                        let neg = 0;
                        if (this.negozio && Array.isArray(this.utente.negozi) && this.utente.negozi.some(n => n.id == this.negozio)) neg = this.negozio;
                        else if (this.utente.negozi.length) {
                            neg = UserHandler.instance.settings.negozio && this.utente.negozi.some(n => n.id == UserHandler.instance.settings.negozio) ?
                                UserHandler.instance.settings.negozio : this.utente.negozi[0].id;
                        }
                        this.updateNegozio(neg);
                    }
                });
            },
            async onLogout() {
                if (UserHandler.instance.user?.sessioni?.length) UserHandler.instance.user.sessioni = UserHandler.instance.user.sessioni.filter(s => s.progetto != this.progetto);
                if (!UserHandler.instance.user?.sessioni || UserHandler.instance.user.sessioni.length == 0) { UserHandler.instance.logout(); }
                else { UserHandler.instance.setSessionUser(); UserHandler.instance.triggerEvent("logout", this.progetto); }
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
                    this.login();
                }
            },
            setNegozioAttivo(evt) {
                this.updateNegozio(Number(evt.currentTarget.getAttribute("value")));
            },
            updateNegozio(neg) {
                this.negozio = Number(neg);
                if (UserHandler.instance.settings) UserHandler.instance.settings.negozio = this.negozio;
                if (UserHandler.instance.user?.sessioni && UserHandler.instance.user.sessioni.some(s => s.progetto == this.progetto))
                    UserHandler.instance.user.sessioni.find(s => s.progetto == this.progetto).attivo = this.negozio;
                UserHandler.instance.setSessionUser();
                sessionStorage.setItem(keyStore, this.negozio);
                this.__node.trigger("negupdate", this.negozio);
                this.__app?.update();
            },
            openEditor() {
                this.user_modal?.open();
            },
            openLogin() {
                if (!this.userIsLogged) this.login_modal?.open();
            },
            scrollNegozi: function () {
                if (this.__element) {
                    var lista = this.__element.querySelector("section[lista='negozi']");
                    if (lista) {
                        var chip = lista.querySelector("div[relevance='primary']");
                        if (chip) lista.scrollTop = chip.offsetTop - 50;
                    }
                }
            },
            async validateSession() {
                //let sessionId = getCookieValue('ASP.NET_SessionId'); //In caso serva controllare l'id di sessione
                let projectName = window.projectName ? "/" + window.projectName : null;
                let projectDirectory = projectName ?? (window.location.host.toLowerCase().includes("localhost") ? "" : "/" + window.location.pathname.split("/")[1]);
                let url = `${window.location.protocol}//${window.location.host}${projectDirectory}/Accesso/ValidateSession`;
                try {
                    let response = await fetch(url);
                    if (response.status == 503 || response.status == 404) { return; };
                    if (!response.ok) {
                        if (document.querySelector("div[obi-alert]")?.innerText.includes("La sessione è scaduta")) return;
                        obiAlert("La sessione è scaduta. Effettuare nuovamente l'accesso.",
                            {
                                type: "warning",
                                timer: 0,
                                actions: [
                                    {
                                        name: "Aggiorna Sessione",
                                        action: async () => {
                                            let hubLoginUrl = `${window.location.protocol}//${window.location.host}${projectDirectory ? "/" + projectDirectory : ""}/Accesso/HubLogin/${UserHandler.instance.user?.codice}`;
                                            let response = fetch(hubLoginUrl).catch((ex) => { console.error(ex); });
                                            if (response.ok) {
                                                if (UserHandler.instance.user?.sessioni) {
                                                    let sessionId = await response.json();
                                                    UserHandler.instance.user.sessioni.find(s => s.progetto == this.progetto).id = sessionId;
                                                    UserHandler.instance.setSessionUser();
                                                }
                                            }
                                            else { obiAlert("Non è stato possibile aggiornare la sessione. Effettuare nuovamente l'accesso.", { type: "error" }); }
                                        },
                                        attributes: { relevance: "primary" },
                                    }
                                ],
                            });
                    }
                    setTimeout(() => { this.validateSession(); }, 60000);
                } catch (ex) { console.error(ex); return; }
            },
            async loadUserApis() {
                const userApiModule = await loadApi(`${API_URL}/obihub/Scripts/Services/utenti.service.js`);
                const tokenApiModule = await loadApi(`${API_URL}/obihub/Scripts/Services/token.service.js`);
                this.apis.token = new tokenApiModule();
                this.apis.utenti = new userApiModule();
            }
        },
        events: [clickRippleEvent,
            {
                name: Collection.node_event.progress,
                action: async function (state) {
                    if (state == Collection.lifecycle.mounted) {
                        if (!isLocal()) await this.loadUserApis();
                        if (UserHandler.instance.logged) {
                            this.onLogin(UserHandler.instance.user);
                        }
                        this.validateSession();
                        window.addEventListener("beforeunload", async () => {
                            if (document.visibilityState === "hidden") await this.onLogout();
                        });
                    }
                }
            }
        ]
    }
});


//Controlla che la password attuale corrisponda
async function checkPasswordEditing(utente, inputCurrent, inputNew, inputRepeat) {

    const currentPassword = inputCurrent.valore;
    const confirmPassword = inputNew.valore;
    const repeatPassword = inputRepeat.valore;

    if (!currentPassword && !confirmPassword && !repeatPassword) return false;

    if (!currentPassword && (confirmPassword || repeatPassword)) {
        inputCurrent.invalid = true;
        inputCurrent.messaggio = "Inserire la vecchia password per la conferma.";
        return false;
    }
    else {
        if (this.apis.utenti === null) return;
        let isSamePassword = await this.apis.utenti.checkPassword({ codice: utente.codice, password: inputCurrent.valore });

        if (!isSamePassword) {
            inputCurrent.invalid = true;
            inputCurrent.messaggio = "Inserire la password corretta.";
            return false;
        }
        inputCurrent.invalid = false;
        inputCurrent.messaggio = "";

        if (confirmPassword) {
            if (isSamePassword && utente.password === confirmPassword) {
                inputNew.invalid = true;
                inputNew.messaggio = "Inserire una password diversa da quella attuale.";
                return false;
            }
            inputNew.invalid = false;
            inputNew.messaggio = "";
        }
    }
    if (repeatPassword) {
        if (confirmPassword !== repeatPassword) {
            inputRepeat.invalid = true;
            inputRepeat.messaggio = "Le password non corrispondono.";
            return false;
        }
        inputRepeat.invalid = false;
        inputRepeat.messaggio = "";
    }

    return true;
}

//OBSOLETE
// //Controlla che la password attuale corrisponda
// checkCurrentPassword() {
//     if (this.password.old != this.utente.password) {
//         this.__node.getChildContext("obi-textbox[name='currentPassword']").invalid = true;
//         this.__node.getChildContext("obi-textbox[name='currentPassword']").messaggio = "Inserire la password corretta.";
//         return false;
//     }
//     this.__node.getChildContext("obi-textbox[name='currentPassword']").invalid = false;
//     this.__node.getChildContext("obi-textbox[name='currentPassword']").messaggio = "";
//     return true;
// },
// //controlla che la password ripetuta sia uguale a quella nuova
// checkSamePassword() {
//     if (this.password.repeat != this.password.updated) {
//         this.__node.getChildContext("obi-textbox[name='repeatPassword']").invalid = true;
//         this.__node.getChildContext("obi-textbox[name='repeatPassword']").messaggio = "Le password non corrispondono.";
//         return false;
//     }
//     this.__node.getChildContext("obi-textbox[name='repeatPassword']").invalid = false;
//     this.__node.getChildContext("obi-textbox[name='repeatPassword']").messaggio = "";
//     return true;
// },
// //Controlla che la nuova password sia diversa da quella attuale
// checkDifferentPassword() {
//     if (this.password.updated == this.password.old) {
//         this.__node.getChildContext("obi-textbox[name='newPassword']").invalid = true;
//         this.__node.getChildContext("obi-textbox[name='newPassword']").messaggio = "Inserire una password diversa da quella attuale.";
//         return false;
//     }
//     this.__node.getChildContext("obi-textbox[name='newPassword']").invalid = false;
//     this.__node.getChildContext("obi-textbox[name='newPassword']").messaggio = "";
//     return true;
// },