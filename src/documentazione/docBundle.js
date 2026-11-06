import { BASE_URL } from "../../obi.config.js";

import intro from "./introduzione.js";
import lamp from "./lampredotto/lampredotto.js";
import render from "./lampredotto/renderModule.js";
import app from "./lampredotto/render.applicazione.js";
import command from "./lampredotto/render.command.js";
import cmd_model from "./lampredotto/render.command.model.js";
import cmd_bind from "./lampredotto/render.command.bind.js";
import cmd_on from "./lampredotto/render.command.on.js";
import cmd_for from "./lampredotto/render.command.for.js";
import cmd_if from "./lampredotto/render.command.if.js";
import cmp from "./lampredotto/render.componenti.js";
import render_imp from "./lampredotto/render.impostazioni.js";
import render_util from "./lampredotto/render.utility.js";
import server from "./lampredotto/serverModule.js";
import access from "./lampredotto/userModule.js";
import componenti from "./obicomponents/componenti.js";
import funzioni from "./obicomponents/funzioni.js";
import stili from "./obicomponents/stili.js";
import serivzi from "./obicomponents/servizi.js";

const documentazione = [
    intro,
    lamp,
    render,
    app,
    command,
    cmd_model,
    cmd_on,
    cmd_bind,
    cmd_for,
    cmd_if,
    cmp,
    render_imp,
    render_util,
    server,
    access,
    componenti,
    stili,
    funzioni,
    serivzi,
    //login
    {
        id: "comp.login",
        nome: "Componenti: OBI-LOGIN",
        source: `${BASE_URL}/components/application/obi-login.js`,
        sezioni: [
            {
                titolo: "Componente di Login",
                note: `Il template del componente di login copre l'intera pagina e gestisce le interazioni con l'accesso dell'utente al progetto.
Il componente sfrutta l'evento @login per trasmettere i dati username e password alla funzione che poi eseguirà effettivamente la chiamata al server e gestirà l'accesso.

 - Il form controlla di default che entrambi <mark>username e password siano inseriti</mark> prima di eseguire il trigger dell'evento di login.
 - I campi del form supportano il <mark>tasto invio</mark> per avviare l'evento di login.
 - E' possibile predisporre un <mark>accesso rapido</mark> tramite la proprietà fastlogin. Se popolata questa proprità eseguirà automaticamente il login.
 - Il componente predispone di un tasto di <mark>richiesta di assistenza</mark> che apre un form dedicato all'invio di una email ad assistenza-it@obi-italia.it`,
                descrizione: `Dimostrazione obi-login`,
                codice: `<obi-login @login='alert("accesso eseguito da " + $.username)'></obi-login>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>portale</strong>[string]: Nome del portale che appare sul titolo del form di login</li>
                    <li><strong>fastlogin</strong>[object: { username: string, password: string }]: Dati di accesso rapido</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>modal</strong>: Restituisce true se l'elemento possiede l'attributo 'modal'</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>modal</strong>: Visualizza il login all'interno di una finestra modale</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>login</strong> -> <code>{ username: string, password: string }</code>: Emesso al completamento del form di accesso</li>
                </ul>
                `
            }
        ]
    },
    //applicazione
    {
        id: "comp.applicazione",
        nome: "Componenti: OBI-APP",
        source: `${BASE_URL}/components/application/obi-app.js`,
        sezioni: [
            {
                titolo: "Componente Applicazione",
                note: `Predispone la struttura dell'applicazione.`,
                descrizione: `Struttura di obi-app`,
                codice: `<obi-app titolo='HEADER' style='width: 500px; height: 200px'>
    <div app-menu slot='navigation' relevance='secondary' padding='md'>MENU</div>
    <app-content slot='content' padding='md'>CONTENUTO</app-content>
    <div app-footer slot='footer' relevance='tertiary' padding='md'>FOOTER</div>
</obi-app>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>titolo</strong>[string]: Nome del progetto, appare accanto al logo OBI.</li>
                    <li><strong>home</strong>[string]: Reindirizza la pagina sul link specificato al click sul logo OBI o sul titolo.</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>isFixed</strong>: Restituisce true se è presente l'attributo 'fixed'</li>
                    <li><strong>isClean</strong>: Restituisce true se è presente l'attributo 'clean'</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>clean</strong>: Rende l'header di colore neutro.</li>
                    <li><strong>fixed</strong>: Fissa in alto l'header senza scorrimento.</li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong>tool[app-tools]</strong>: Inserisce il contenuto nella lista di opzioni all'interno dell'header, deve avere l'attribito app-tools per ereditare lo stile</li>
                    <li><strong>navigation[app-menu]</strong>: Posiziona il tag nello spazio di navigazione, deve avere l'attribito app-menu per ereditare lo stile</li>
                    <li><strong>content[app-content]</strong>: Posiziona il tag nello spazio del contenuto dell'applicazione, deve avere l'attribito app-content per ereditare lo stile</li>
                    <li><strong>footer[app-footer]</strong>: Posiziona il tag nello spazio del piè di pagina, deve avere l'attribito app-footer per ereditare lo stile</li>
                </ul>
                `
            }
        ]
    },
    //applicazione.header
    {
        id: "comp.applicazione.header",
        nome: "Componenti: APP-HEADER",
        source: `${BASE_URL}/components/application/app-header.js`,
        sezioni: [
            {
                titolo: "Il Componente Header",
                note: `L'Header è un elemento di interfaccia dell'applicazione, si divide strutturalmente in due sezioni partendo da sinistra:
                - Il Logo dell'azienda e il titolo del progetto
                - La lista di strumenti di utilità nella gestione del progetto`,
                descrizione: "Esempio app-header",
                codice: `<app-header titolo='Dimostrazione' link='#' fixed>
    <div slot='tools' app-tools>
        <app-info href='#'></app-info>
    </div>
</app-header>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>titolo</strong>[string]: Il titolo del progetto</li>
                    <li><strong>link</strong>[string]: Il link di reindirizzamento al click su logo e titolo</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>clean</strong>: Rende l'header di colore neutro.</li>
                    <li><strong>fixed</strong>: Fissa in alto l'header senza scorrimento.</li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong>tool[app-tools]</strong>: La lista di strumenti di gestione del progetto, deve avere l'attributo app-tools per ereditare lo stile</li>
                </ul>
                `
            }
        ]
    },
    //applicazione.tool
    {
        id: "comp.applicazione.tool",
        nome: "Applicazione: TOOL-ITEM",
        source: `${BASE_URL}/components/application/tool-item.js`,
        sezioni: [
            {
                titolo: "Il Componente tool-item",
                note: `Il tool-item è un componente che predispone un tasto nella lista degli strumenti all'unterno dell'header.`,
                descrizione: "Esempio utilizzo tool-item",
                codice: `<tool-item icona='info' @click='location.href = "http://www.obi.info/"'></tool-item>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>icona</strong>[string]: Icona google symbols del tool</li>
                </ul>
                `
            },
        ]
    },
    //applicazione.search
    {
        id: "comp.applicazione.search",
        nome: "Componenti: APP-SEARCH",
        source: `${BASE_URL}/components/application/app-search.js`,
        sezioni: [
            {
                titolo: "Il Componente di Ricerca",
                note: `App search aggiunge all'header dell'applicazione una barra di ricerca.
                E' possibile popolare le opzioni di ricerca tramite l'attributo 'opzioni' passando un array di oggetti con le seguenti proprietà:
                
                <code>{ value(valore di ricerca), title(titolo del contenuto ricercato), content(contenuto ricercato) }</code>
                
                al click sulla voce di ricerca viene attivato l'evento appsearch da usare per reindirizzare il contenuto del sito.`,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>opzioni</strong>[{ value: any, title: string, content: string }[]]: La lista di elementi di ricerca</li>
                    <li><strong>label</strong>[string]: Il testo del placeholder</li>
                </ul>
                `
            },
            {
                titolo: "EVENTI",
                note: `
                <ul>
                    <li><strong>@appsearch</strong> -> <code>value: any</code>: esegue la ricerca, comunica il value dell'oggetto delle opzioni di ricerca selezionato</li>
                </ul>
                `
            }
        ],
    },
    //applicazione.info
    {
        id: "comp.applicazione.info",
        nome: "Applicazione: APP-INFO",
        source: `${BASE_URL}/components/application/app-info.js`,
        sezioni: [
            {
                titolo: "Il Componente app-info",
                note: "app-info è un tool-item dedicato al reindirizzamento ad una pagina esterna o interna al portale che abbia lo scopo di descrivere il progetto. Questa pagina viene aprta in un nuovo tab del browser.",
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>href</strong>[url]: link alla pagina informativa</li>
                </ul>
                `
            },
        ],
    },
    //applicazione.settings
    {
        id: "comp.applicazione.settings",
        nome: "Applicazione: APP-SETTINGS",
        source: `${BASE_URL}/components/application/app-settings.js`,
        sezioni: [
            {
                titolo: "Il Componente app-settings",
                note: `Il componente app-settings predispone un elemento tool-item con menu fluttuante per consentire la definizione di una lista di impostazioni.
                Questo componente si accompagna ad un altro chiamato app-settings-list all'interno del quale è possibile definire la lista dei controlli per le impostazinoi.
                
                La personalizzazione delle impostazioni per funzionare si appoggia al modulo UserModule e sfruttando la sua componente statica UserHandler.instance è possibile interagire con i dati dell'utente salvandone le proprietà in sessione o sulla memoria locale del browser.
                `,
                codice: `<app-settings>
    <app-settings-list>
        <settings-item label='Tabella' icona='table'></settings-item>
    </app-settings-list>
</app-settings>`,
                preview: true,
            },
            {
                titolo: "Impostazioni Prefabbricate",
                note: `OBIComponents propone una serie di componenti che definiscono delle impostazinoi prefabbricate:
                <ul>
                    <li><strong>settings-item-darkmode</strong>: aggiunge il controllo sulla darkmode</li>
                    <li><strong>settings-item-theme</strong>: permette di personalizzare il tema del portale</li>
                    <li><strong>settings-item-radius</strong>: permette di personalizzare la smussatura dei bordi del portale</li>
                </ul>
                `,
                descrizione: "Esempio app-settings",
                codice: `<app-settings>
    <app-settings-list>
        <settings-item-darkmode></settings-item-darkmode>
        <settings-item-theme></settings-item-theme>
        <settings-item-radius></settings-item-radius>
    </app-settings-list>
</app-settings>`,
                preview: true,
            },
            {
                titolo: "settings-item",
                note: "Oltre alle impostazioni prefabbricate il tag <code>settings-item</code> permette di aggiungere agilmente una nuova voce alle impostazioni.",
            },
            {
                titolo: "INPUTS",
                note: `<ul>
                <li><strong>label</strong>[string]: Il nome dell'impostazione</li>
                <li><strong>icona</strong>[string]: L'icona dell'impostazione</li>
                </ul>`,
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>prepend</strong>: Restituisce il valore dell'attributo 'prepend' per l'icona</li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong>impostazioni</strong>: Slot per aggiungere voci personalizzate al menu impostazioni</li>
                </ul>
                `
            }
        ],
    },
    //applicazione.user
    {
        id: "comp.applicazione.user",
        nome: "Applicazione: APP-USER",
        source: `${BASE_URL}/components/application/app-user.js`,
        sezioni: [
            {
                titolo: "Il Componente app-user",
                note: `
                Questo componente genera una card di riepilogo con i dati dell'utente loggato.
                Di default un utente viene rappresentato da questo oggetto:
                <code>
                {
                    username: string,
                    nome: string,
                    cognome: string,
                    ruolo: string,
                    reparto: string,
                    email: string,
                    telefono: string,
                    password: string,
                    negozi: { id: number, nome: string }[],
                    fornitori: { id: number, nome: string }[],
                    profilo: url,
                }
                </code>

                Oltre a mostrare i dati dell'utente questo componente mette a disposizione la possibilità di <mark>associare un negozio ed un fornitore alla sessione</mark>, un <mark>form di modifica dei dati dell'utente</mark> ed il <mark>tasto di logout</mark>.
                `,
                descrizione: "Esempio utente",
                codice: `<app-user :utente='user'></app-user>`,
                preview: true,
                dataset: {
                    user: {
                        username: "mbiagini",
                        nome: "Marco",
                        cognome: "Biagini",
                        ruolo: "Sviluppatore",
                        email: "marco.biagini@obi-italia.it",
                        telefono: "0574-5184-542",
                        password: "",
                    }
                }
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>utente</strong>[object]: I dati dell'utente loggato, se non specificato questi verranno caricati dallo UserHandler dello UserModule</li>
                    <li><strong>negozio</strong>[object]: L'id del negozio legato all'utente in sessione</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>season</strong>: Restituisce il percorso dell'immagine di sfondo stagionale corrente per la card</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>logout</strong> -> <code>utente</code>: Emesso al click sul pulsante di logout</li>
                    <li><strong>edit</strong> -> <code>utente</code>: Emesso per richiedere la modifica dei dati utente</li>
                    <li><strong>login</strong> -> <code>utente</code>: Emesso all'accesso dell'utente</li>
                    <li><strong>negupdate</strong> -> <code>negozio</code>: Emesso all'aggiornamento del negozio selezionato</li>
                </ul>
                `
            }
        ],
    },
    //intercaccia.currency
    {
        id: "comp.interfaccia.currency",
        nome: "Componenti: OBI-CURRENCY",
        source: `${BASE_URL}/components/interface/obi-currency.js`,
        sezioni: [
            {
                titolo: "Il componente obi-currency",
                note: `Questo componente stampa i numeri a schermo in un formato a due decimali col simbolo della valuta.`,
                descrizione: "Dimostrazione",
                codice: `<obi-currency valore='245.09832' valuta='USD' locale='en-US'></obi-currency>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>valore</strong>[number]: il numero da convertire in valuta</li>
                    <li><strong>valuta</strong>[string { "EUR", "USD" }]: opzionale (default EUR); è il numero da convertire in valuta</li>
                    <li><strong>locale</strong>[string { "it-IT", "en-US" }]: opzionale (default it-IT); è la sigla della lingua-località in cui vogliamo la valuta</li>
                </ul>
                `
            },
        ],
    },
    //intercaccia.chip
    {
        id: "comp.interfaccia.chip",
        nome: "Componenti: OBI-CHIP",
        source: `${BASE_URL}/components/interface/obi-chip.js`,
        sezioni: [
            {
                titolo: "Il componente obi-chip",
                note: `Questo componente permette di creare una cosìdetta chip, ovvero una piccola label funzionale per elenchi interattivi e non di singole voci.`,
                codice: `<obi-chip label='mbiagini' prepend='close' relevance='secondary'></obi-currency>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>label</strong>[string]: il testo della chip</li>
                    <li><strong>prepend</strong>[string]: opzionale; icona google symbols da far apparire prima della label</li>
                    <li><strong>append</strong>[string]: opzionale; icona google symbols da far apparire dopo la label</li>
                </ul>
                `
            },
        ],
    },
    //intercaccia.cover
    {
        id: "comp.interfaccia.cover",
        nome: "Componenti: OBI-COVER",
        source: `${BASE_URL}/components/interface/obi-cover.js`,
        sezioni: [
            {
                titolo: "Il Componente obi-cover",
                note: `Questo componente si occupa di visualizzare le immagini. Si integra negli altri componenti come ad esempio nelle card.`,
                descrizione: "Dimostrazione obi-cover",
                codice: `
                <obi-cover link='${BASE_URL}/resources/images/ombrellonisconti.jpg' titolo='Vivi la tua estate' sottotitolo="OFFERTE STAGIONALI"  size='xl'></obi-cover>
                `,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>link</strong>[url]: link all'immagine da mostrare</li>
                    <li><strong>titolo</strong>[string]: Titolo dell'immagine in sovrimpressione</li>
                    <li><strong>sottotitolo</strong>[string]: Sottotitolo dell'immagine in sovrimpressione</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>size</strong> ('xs', 'sm', 'md', 'lg', 'xl', 'xxl')</li>
                </ul>
                `
            },
        ],
    },
    //intercaccia.icona
    {
        id: "comp.interfaccia.icon",
        nome: "Componenti: OBI-ICON & OBI-LOGO",
        source: `${BASE_URL}/components/interface/obi-icon.js`,
        sezioni: [
            {
                titolo: "I Componenti obi-icon e obi-logo",
                note: `Questi componenti servono entrambi per accompagnare o indicare delle azioni e dei testi nell'interfaccia.
                Sono intesi nell'utilizzo di immagini o icone come miniature ad esempio al fianco di voci di menu o di titoli.`,
                descrizione: "Dimostrazione",
                codice: `<obi-icon nome='person' relevance='primary' circle margin='sm' size='md'></obi-icon>
<obi-logo link='${BASE_URL}/resources/images/obi_squirrel.png' relevance='neutral' circle margin='sm' size='md'></obi-logo>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>nome</strong>[string]: Il nome dell'icona google symbols nel caso di obi-icon</li>
                    <li><strong>link</strong>[string]: Il link dell'immagine nel caso di obi-logo</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>size</strong> ('xs', 'sm', 'md', 'lg', 'xl', 'xxl')</li>
                    <li><strong>circle</strong>: racchiude l'elemento in un cerchio</li>
                </ul>
                `
            },
        ],
    },
    //intercaccia.titolo
    {
        id: "comp.interfaccia.title",
        nome: "Componenti: OBI-TITLE",
        source: `${BASE_URL}/components/interface/obi-title.js`,
        sezioni: [
            {
                titolo: "Il componente obi-title",
                note: `Questo componente grafico predispone il testo in un formato titolo - sottotitolo con font e dimensioni preimpostati e standardizzati.`,
                descrizione: "Dimostrazione",
                codice: `<obi-title titolo='ARTICOLI IN OFFERTA' descrizione='Lista degli articoli appartenenti allo stock natalizio' ></obi-title>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>titolo</strong>[string]</li>
                    <li><strong>descrizione</strong>[string]</li>
                </ul>
                `
            },
        ],
    },
    //intercaccia.headline
    {
        id: "comp.interfaccia.headline",
        nome: "Componenti: OBI-HEDLINE",
        source: `${BASE_URL}/components/interface/obi-headline.js`,
        sezioni: [
            {
                titolo: "Il componente obi-headline",
                note: `Questo componente grafico stampa un titolo miniaturizzato utile per dividere in sezioni delle liste di argomenti.`,
                descrizione: "Dimostrazione",
                codice: `<obi-headline label='ARTICOLI IN OFFERTA'></obi-headline>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>label</strong>[string]</li>
                </ul>
                `
            },
        ],
    },
    //interfaccia.alert
    {
        id: "comp.interfaccia.alert",
        nome: "Funzioni: OBI-ALERT",
        source: `${BASE_URL}/components/dialog/obi-alert.js`,
        sezioni: [
            {
                titolo: "La funzione obiAlert",
                note: `La funzione <code>obiAlert</code> è una versione personalizzata della api Javascript <code>alert</code> standard.
                Per i dettagli su come usare questa funzioni consultare la documentazione sulle funzioni di OBIComponents.
                `,
            },
        ]
    },
    //interfaccia.card
    {
        id: "comp.interfaccia.card",
        nome: "Componenti: OBI-CARD",
        source: `${BASE_URL}/components/card/obi-card.js`,
        sezioni: [
            {
                titolo: "Il componente obi-card",
                note: `Questo componente funge da contenitore strutturato in 3 sezioni, una sezione di testa con titolo e sottotitolo, un corpo che racchiude il contenuto desiderato e una sezione dedicata alle interazioni tramite tasti.
                `,
                descrizione: "Esempio",
                codice: `<obi-card titolo='Gazebo modello verde' descrizione='Articoli da Giardino' :corpo='lorem' variant='filled' prepend='<obi-icon nome="deceased"></obi-icon>'></obi-card>`,
                dataset: {
                    lorem: "eque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur",
                },
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>titolo</strong>[string]: Il titolo della card</li>
                    <li><strong>descrizione</strong>[string]: Il sottotitolo della card</li>
                    <li><strong>prepend</strong>[string | html]: Elemento a fianco sinistro del titolo</li>
                    <li><strong>append</strong>[string | html]: Elemento a fianco destro del titolo</li>
                    <li><strong>corpo</strong>[string]: Contenuto testuale della card</li>
                    <li><strong>icon</strong>[string]: Icona a fianco sinistro del titolo</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>collapse</strong>["hide" | "show"]: Se valorizzato hide nasconde il corpo della card, altrimenti lo mostra</li>
                </ul>
                `
            }
        ]
    },
    //interfaccia.modal
    {
        id: "comp.interfaccia.modal",
        nome: "Componenti: OBI-MODAL",
        source: `${BASE_URL}/components/dialog/obi-modal.js`,
        sezioni: [
            {
                titolo: "Il componente obi-modal",
                note: `Questo componente permette di impostare una finestra fluttuante in sovrimpressione all'interno della quale far apparire del contenuto.`,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>display</strong>[boolean]: Il parametro che fa apparire o sparire il modale</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>focus</strong>: Se specificato fa apparire un layer trasparente interagibile che copre il contenuto della pagina ed al click chiude la finestra modale</li>
                    <li><strong>size</strong>['file', 'large', 'cover']: Indica la dimensione della finestra modale</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>focus</strong>: Restituisce true se l'elemento possiede l'attributo 'focus'</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>open()</strong>: Fa apparire il modale</li>
                    <li><strong>close()</strong>: Chiude il modale</li>
                    <li><strong>toggle()</strong>: Fa apparire e chiude il modale in base allo stato di visibilità</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>close</strong>: Emesso alla chiusura della finestra modale</li>
                </ul>
                `
            }
        ]
    },
    //interfaccia.badge
    {
        id: "comp.interfaccia.badge",
        nome: "Componenti: OBI-BADGE",
        source: `${BASE_URL}/components/interface/obi-badge.js`,
        sezioni: [
            {
                titolo: "Il componente obi-badge",
                note: `Questo componente è un elemento grafico utile ad indicare delle notifiche o comunque per porre attenzione dell'utente su una sezione dell'interfaccia o su un'icona.
                Di base questo componente dispone di una label pensata per ospitare un contatore ma può essere anche minimizzato ad indicatore generico di notifica.`,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>label</strong>[string]: Il contatore del badge</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>dot</strong>: minimizza il badge</li>
                </ul>
                `
            }
        ]
    },
    //interfaccia.sideview
    {
        id: "comp.interfaccia.sideview",
        nome: "Componenti: OBI-SIDEVIEW",
        source: `${BASE_URL}/components/interface/obi-sideview.js`,
        sezioni: [
            {
                titolo: "Il componente obi-sideview",
                note: `Il componente sideview permette di racchiudere un contenuto della pagina in un elemento a scomparsa verticale.
                Questo componente è utile per contenere ad esempio una sezione dedicata ai dettagli o messaggi.`,
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>display</strong>: Restituisce true se l'elemento possiede l'attributo 'display'</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>display</strong>: Mostra il pannello laterale a comparsa</li>
                    <li><strong>relevance</strong>['brand', 'primary', 'secondary']: Livello cromatico del pannello</li>
                    <li><strong>variant</strong>['outlined']: Variante grafica del pannello con bordo</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>open()</strong>: Fa apparire il componente aggiungendo l'attributo display</li>
                    <li><strong>close()</strong>: Chiude il componente rimuovendo l'attributo display</li>
                    <li><strong>toggle()</strong>: Inverte la visualizzazione del componente tra aperto e chiuso</li>
                </ul>
                `
            }
        ]
    },
    //dati.table
    {
        id: "comp.dati.tabella",
        nome: "Componenti: OBI-TABLE",
        source: `${BASE_URL}/components/datatable/obi-table.js`,
        sezioni: [
            {
                titolo: "Il componente obi-table",
                note: `Il componente obi-table è costruito per mostrare a schermo liste di dati sotto forma di tabella.
All'interno è compreso un sistema di impaginazione dei dati automatico basato sul numero di righe.

I dati che vengono passati al componente obi-table vengono duplicati e salvati nello storage per questioni di ottimizzazione. Per lo stesso motivo le righe stampate all'interno non sono legate dinamicamente ai dati del componente; per aggiornare la vista è necessario richiamare la funzione update().`,
                descrizione: "Esempio obi-table",
                codice: `<obi-table :dati='righe' :colonne='colonne' chiave='id' righe='5' alternate interact></obi-table>

<script>
const righe = [
    { id: 1, nome: "Ada", ruolo: "Analista" },
    { id: 2, nome: "Luca", ruolo: "Sviluppatore" }
];
const colonne = ["id", "nome", { name: "ruolo", label: "Ruolo" }];
</script>`,
                preview: false,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>dati</strong>[array]: Lista di dati da renderizzare</li>
                    <li><strong>colonne</strong>[string[] | {nome: string, valore: string, type: string, format: function(value)}[]]: Lista di definizioni delle colonne da mostrare</li>
                    <li><strong>chiave</strong>[string]: Nome della proprietà identificativa della singola riga per la selezione</li>
                    <li><strong>ordine</strong>[string]: Nome della proprietà che ordina la lista</li>
                    <li><strong>filtro</strong>[object]: Oggetto contenente le proprietà e valori per il filtraggio</li>
                    <li><strong>righe</strong>[number]: Numero di righe visualizzate per pagina</li>
                    <li><strong>src</strong>[string]: URL endpoint opzionale per il caricamento asincrono dei dati</li>
                    <li><strong>shorts</strong>[object]: Scorciatoie di filtro e visualizzazione</li>
                    <li><strong>modello</strong>[object]: Modello di dati opzionale per la definizione dello schema</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>last_page</strong>: Calcola l'indice dell'ultima pagina in base ai record totali e alle righe per pagina</li>
                    <li><strong>count_first</strong>: Calcola l'indice del primo record visualizzato nella pagina corrente</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>loading</strong>: Mostra l'indicatore di caricamento sulla tabella</li>
                    <li><strong>alternate</strong>: Alterna i colori di sfondo delle righe della tabella</li>
                    <li><strong>interact</strong>: Abilita il feedback visivo al passaggio del cursore sulle righe</li>
                    <li><strong>filter-collapse</strong>: Contrae o espande l'area superiore dei filtri</li>
                    <li><strong>size</strong>['sm', 'md', 'lg']: Dimensione e spaziatura delle celle della tabella</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>update()</strong>: Aggiorna la vista e il rendering dei dati della tabella</li>
                    <li><strong>addFilter(object)</strong>: Aggiunge un oggetto filtro ed aggiorna la tabella</li>
                    <li><strong>removeFilter(object)</strong>: Rimuove i filtri corrispondenti ed aggiorna la tabella</li>
                    <li><strong>cleanFilter()</strong>: Rimuove tutti i filtri reimpostando la vista originale</li>
                    <li><strong>export(filename, options)</strong>: Esporta i dati filtrati e ordinati in formato CSV</li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong>filtro</strong>: Consente di inserire form o controlli di filtro personalizzati sopra le intestazioni di colonna</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>rowclick</strong> -> <code>datiRiga</code>: Emesso al click su una riga della tabella</li>
                    <li><strong>rowselect</strong> -> <code>datiRiga</code>: Emesso alla selezione di una riga</li>
                    <li><strong>dataview</strong> -> <code>datiFiltrati</code>: Emesso quando la vista dati viene aggiornata o impaginata</li>
                    <li><strong>cleanfilter</strong>: Emesso al reset dei filtri di ricerca</li>
                </ul>
                `
            }
        ]
    },
    //dati.lista
    {
        id: "comp.dati.lista",
        nome: "Componenti: OBI-LIST",
        source: `${BASE_URL}/components/list/obi-list.js`,
        sezioni: [
            {
                titolo: "Il componente obi-list",
                note: `Il componente obi-list è un contenitore flessibile per la visualizzazione di elenchi verticali di elementi (list-item).
Supporta varie dimensioni, interattività al click e varianti stilistiche per organizzare informazioni, menu a comparsa o elenchi selezionabili con checkbox o radio button.`,
                descrizione: "Esempio obi-list",
                codice: `<obi-list interact>
    <list-item testo='Elemento 1' descrizione='Descrizione elemento 1' icon='folder'></list-item>
    <list-item testo='Elemento 2' descrizione='Descrizione elemento 2' icon='description'></list-item>
</obi-list>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `Gli elementi <code>list-item</code> contenuti nella lista supportano i seguenti input:
                <ul>
                    <li><strong>testo</strong>[string]: Titolo principale della riga</li>
                    <li><strong>descrizione</strong>[string]: Sottotitolo o testo descrittivo secondario</li>
                    <li><strong>prepend</strong>[string]: Icona o elemento visualizzato all'inizio della riga</li>
                    <li><strong>append</strong>[string]: Icona o elemento visualizzato in coda alla riga</li>
                    <li><strong>selezione</strong>[boolean]: Stato di selezione o spunta dell'elemento</li>
                    <li><strong>icon</strong>[string]: Icona a fianco sinistro del titolo</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `I <code>list-item</code> espongono i seguenti parametri calcolati:
                <ul>
                    <li><strong>isSelectable</strong>: Restituisce true se l'elemento possiede l'attributo 'check'</li>
                    <li><strong>isRadio</strong>: Restituisce true se l'attributo check è impostato a 'radio'</li>
                    <li><strong>isChecked</strong>: Restituisce true se l'elemento è selezionabile ed attualmente selezionato</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>interact</strong>: Rende gli elementi della lista interattivi con effetto hover e cursore pointer</li>
                    <li><strong>variant</strong>['outlined', 'filled', 'elevated']: Stile grafico del contenitore della lista</li>
                    <li><strong>size</strong>['sm', 'lg', 'xl']: Dimensione degli elementi e delle icone prepend/append</li>
                    <li><strong>floating-item</strong>: Limita l'altezza massima con scorrimento per l'uso in menu a tendina e float container</li>
                    <li><strong>x2</strong>: Tronca la descrizione a una singola riga con puntini di sospensione</li>
                    <li><strong>x3</strong>: Limita la descrizione a un massimo di due righe di testo</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `Gli elementi <code>list-item</code> espongono la seguente funzione:
                <ul>
                    <li><strong>onSelect()</strong>: Commuta lo stato di selezione booleana se l'elemento è configurato con l'attributo check</li>
                </ul>
                `
            }
        ]
    },
    //dati.form
    {
        id: "comp.dati.form",
        nome: "Componenti: OBI-FORM",
        source: `${BASE_URL}/components/form/obi-form.js`,
        sezioni: [
            {
                titolo: "Il componente obi-form",
                note: `Il componente obi-form standardizza la gestione e l'invio dei form nell'applicazione.
Integra la validazione automatica di tutti i campi di input OBIComponents, il supporto nativo per richieste HTTP asincrone (POST, PUT, DELETE), messaggi di notifica di successo/errore e pulsanti di azione integrati per salvataggio e cancellazione.`,
                descrizione: "Esempio obi-form",
                codice: `<obi-form :modello='dati' submit='https://api.example.com/salva' messaggio='Dati salvati con successo'>
    <div slot='inputForm'>
        <obi-textbox label='Nome' :valore='dati.nome' required></obi-textbox>
    </div>
</obi-form>`,
                preview: false,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>submit</strong>[string]: URL endpoint a cui inviare la richiesta di salvataggio</li>
                    <li><strong>modello</strong>[object]: Oggetto dati associato al form da inviare nella richiesta</li>
                    <li><strong>messaggio</strong>[string]: Messaggio di notifica mostrato (obiAlert) in caso di operazione completata con successo</li>
                    <li><strong>request</strong>[string]: Metodo HTTP per la richiesta (default: 'POST')</li>
                    <li><strong>label</strong>[string]: Testo dell'etichetta del pulsante di submit (default: 'Salva')</li>
                    <li><strong>icona</strong>[string]: Nome dell'icona Material Symbols sul pulsante di submit (default: 'save')</li>
                    <li><strong>relevance</strong>[string]: Rilevanza cromatica del pulsante di submit (default: 'primary')</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>isRemovable</strong>: Restituisce true se il form possiede l'attributo 'removable' o 'enable-remove'</li>
                    <li><strong>isAutoSubmit</strong>: Restituisce true se è presente l'attributo 'auto-submit'</li>
                    <li><strong>showSaveButton</strong>: Determina se mostrare il pulsante di salvataggio in base alle modifiche e alla modalità auto-submit</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>removable</strong>: Mostra il pulsante 'Rimuovi' nella barra delle azioni</li>
                    <li><strong>enable-remove</strong>[url]: Specifica l'endpoint URL per l'eliminazione con richiesta DELETE</li>
                    <li><strong>auto-submit</strong>: Attiva l'invio automatico dei dati modificati dopo un ritardo di 1 secondo</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>submitData()</strong>: Esegue la validazione dei campi e inoltra i dati all'endpoint tramite Service</li>
                    <li><strong>getformData()</strong>: Restituisce un'istanza di FormData con i dati del form</li>
                    <li><strong>validateInput()</strong>: Esegue il controllo di validità su tutti i campi di input contenuti nel form</li>
                    <li><strong>remove(evt)</strong>: Esegue la rimozione dei dati richiamando l'endpoint impostato in enable-remove</li>
                    <li><strong>onEdit()</strong>: Notifica la modifica di un campo avviando il timer per l'auto-submit</li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong>inputForm</strong>: Slot principale all'interno del corpo della card in cui inserire i campi di input</li>
                    <li><strong>actions</strong>: Slot per inserire pulsanti o azioni personalizzate nella barra inferiore</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>action</strong> -> <code>modello</code>: Emesso prima dell'invio dei dati, trasmette il modello dei dati</li>
                    <li><strong>submitsuccess</strong> -> <code>response</code>: Emesso dopo il salvataggio con successo, trasmette la risposta JSON del server</li>
                    <li><strong>submiterror</strong> -> <code>error</code>: Emesso se la richiesta HTTP fallisce, trasmette l'errore riscontrato</li>
                    <li><strong>remove</strong> -> <code>response | evt</code>: Emesso al click sul pulsante di eliminazione con la risposta o l'evento</li>
                </ul>
                `
            }
        ]
    },
    //dati.email
    {
        id: "comp.dati.email",
        nome: "Componenti: OBI-EMAIL",
        source: `${BASE_URL}/components/email/obi-email.js`,
        sezioni: [
            {
                titolo: "Il componente obi-email",
                note: `Il componente obi-email fornisce un modulo per comporre e inviare email. Include destinatari, campi CC e BCC attivabili, oggetto e messaggio. La rubrica può alimentare i suggerimenti per i destinatari; prima dell'invio vengono controllati destinatario, oggetto e contenuto.`,
                descrizione: "Esempio obi-email",
                codice: `import EmailRequest from './src/models/EmailRequest.js';

const email = new EmailRequest({
    header: {
        receiver: 'mario@example.com',
        copy: '',
        blind: '',
        subject: 'Aggiornamento progetto'
    },
    content: ['Ciao Mario,', 'ecco l’aggiornamento del progetto.']
});

const rubrica = [
    { label: 'Mario Rossi', value: 'mario@example.com' },
    { label: 'Luisa Bianchi', value: 'luisa@example.com' }
];

<obi-email :email='email' :rubrica='rubrica' action='/api/email'></obi-email>`,
                preview: false,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>email</strong>[EmailRequest]: Dati del messaggio, inclusi header, destinatari, oggetto e contenuto</li>
                    <li><strong>rubrica</strong>[{ label: string, value: string }[]]: Opzioni suggerite per i campi destinatari, CC e BCC</li>
                    <li><strong>action</strong>[string]: Endpoint a cui inviare l'email con una richiesta PUT; se omesso, il componente emette l'evento <code>send</code></li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>send()</strong>: Aggiorna i dati del messaggio, li valida e avvia l'invio</li>
                    <li><strong>validate()</strong>: Verifica che siano presenti almeno un destinatario, un oggetto e un messaggio</li>
                    <li><strong>updateContent()</strong>: Copia i campi del modulo nell'oggetto email</li>
                    <li><strong>resetForm()</strong>: Reimposta il messaggio e il modulo dopo un invio riuscito</li>
                    <li><strong>syncForm()</strong>: Popola i campi del modulo dai dati dell'oggetto email</li>
                    <li><strong>setup(email, rubrica)</strong>: Imposta il messaggio e, se fornita, la rubrica</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>send</strong> -> <code>EmailRequest</code>: Emesso con una copia dei dati del messaggio dopo la validazione; quando è impostato <code>action</code>, viene emesso dopo la risposta HTTP riuscita</li>
                </ul>
                `
            }
        ]
    },
    //dati.label
    {
        id: "comp.dati.label",
        nome: "Componenti: OBI-LABEL",
        source: `${BASE_URL}/components/interface/obi-label.js`,
        sezioni: [
            {
                titolo: "Il componente obi-label",
                note: `Il componente obi-label visualizza una coppia etichetta-valore, utile per presentare in modo compatto i campi di un record o i dettagli di un elemento. Può mostrare un'icona accanto all'etichetta e dispone di varianti di layout orizzontale o verticale per adattarsi allo spazio disponibile.`,
                descrizione: "Esempio obi-label",
                codice: `<obi-label label='Email' valore='applicativi@obi-italit.it' icona='email' full-column>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>label</strong>[string]: Nome della proprietà</li>
                    <li><strong>valore</strong>[object]: Valore della proprietà</li>
                    <li><strong>icona</strong>[string]: Icona Material Icon di Google sul lato sinistro del nome della proprietà</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>column</strong>: Imposta lo sviluppo della label in verticale con titolo sopra e valore sotto</li>
                    <li><strong>full-column</strong>: Imposta lo sviluppo della label in verticale per tutti gli elementi</li>
                    <li><strong>size</strong>['xs', 'sm', 'md', 'lg', 'xl', 'xxl']: Dimensione del testo</li>
                </ul>
                `
            }
        ]
    },
    //dati.chat
    {
        id: "comp.dati.chat",
        nome: "Componenti: OBI-CHAT",
        source: `${BASE_URL}/components/chat/obi-chat.js`,
        sezioni: [
            {
                titolo: "Il componente obi-chat",
                note: `Il componente obi-chat offre un'interfaccia ricca e completa per la messaggistica e la collaborazione in tempo reale.
Include gestione dei messaggi, risposte a catena, allegati (file e immagini), formattazione, menzioni utente, invio email e pannello laterale per la gestione dei membri e dei contenuti multimediali.`,
                descrizione: "Esempio obi-chat",
                codice: `import Chat from './src/models/Chat.js';
import Message from './src/models/Message.js';

const chatData = new Chat({
    codice: 'progetto-42',
    nome: 'Progetto OBI',
    members: [],
    messages: [
        new Message({
            id: 1,
            nome: 'Ada Rossi',
            note: 'Ciao, condivido il primo aggiornamento.',
            idOwner: 12,
            idStato: 2,
            timeStamp: new Date()
        })
    ]
});

<obi-chat :chat='chatData'></obi-chat>`,
                preview: false,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>chat</strong>[Chat]: Modello dati contenente l'elenco dei messaggi, partecipanti e impostazioni della conversazione</li>
                    <li><strong>src</strong>[string]: URL endpoint API per il recupero dei messaggi</li>
                    <li><strong>submit</strong>[string]: URL endpoint API per l'invio dei messaggi</li>
                    <li><strong>relevance</strong>[string]: Rilevanza cromatica del tema della chat (default: 'primary')</li>
                    <li><strong>tabs</strong>[array]: Schede aggiuntive o viste configurabili all'interno della chat</li>
                    <li><strong>progetto</strong>[string]: Codice identificativo del progetto correlato alla conversazione</li>
                    <li><strong>messaggio</strong>[string]: Testo predefinito da pre-popolare nell'editor di input</li>
                    <li><strong>mailinglist</strong>[array]: Elenco di destinatari per l'invio o inoltro via posta elettronica</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>id</strong>: Restituisce l'identificativo ID dell'elemento chat</li>
                    <li><strong>currentUser</strong>: Restituisce i dati dell'utente autenticato ricavati da UserHandler</li>
                    <li><strong>isEditable</strong>: Restituisce true se i messaggi possono essere modificati in base alle impostazioni</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>view</strong>['chat' | 'details']: Commuta la visualizzazione tra l'elenco messaggi ('chat') e il pannello dettagli ('details')</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>visualizzaMessaggi()</strong>: Invia al server la notifica di visualizzazione/lettura dei messaggi non letti</li>
                    <li><strong>toggleDetails()</strong>: Alterna la visualizzazione del pannello laterale dei dettagli</li>
                    <li><strong>attachToMessage(evt)</strong>: Gestisce l'aggiunta di allegati tramite drag and drop</li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong>editor</strong>: Slot per personalizzare l'area dell'editor di testo per i messaggi</li>
                    <li><strong>dettagli</strong>: Slot per aggiungere sezioni personalizzate all'interno del pannello dettagli</li>
                    <li><strong>senders</strong>: Slot per aggiungere pulsanti o opzioni personalizzate nella barra di invio</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>sending</strong> -> <code>messaggio</code>: Emesso all'inizio della procedura di invio del messaggio</li>
                    <li><strong>sent</strong> -> <code>messaggio</code>: Emesso al completamento dell'invio del messaggio</li>
                    <li><strong>mentioned</strong> -> <code>utente</code>: Emesso quando un utente viene menzionato nel testo</li>
                    <li><strong>updated</strong> -> <code>messaggio</code>: Emesso alla modifica con successo di un messaggio</li>
                    <li><strong>deleted</strong> -> <code>messaggio</code>: Emesso alla cancellazione di un messaggio</li>
                    <li><strong>model-update</strong> -> <code>model</code>: Emesso all'aggiornamento del modello dati della chat</li>
                    <li><strong>details</strong> -> <code>view</code>: Emesso al cambio della vista di dettaglio</li>
                    <li><strong>error</strong> -> <code>errore</code>: Emesso al verificarsi di un errore durante le operazioni della chat</li>
                </ul>
                `
            }
        ]
    },
    //input.button
    {
        id: "comp.input.button",
        nome: "Componenti: OBI-BUTTON",
        source: `${BASE_URL}/components/input/obi-button.js`,
        sezioni: [
            {
                titolo: "Il componente obi-button",
                note: `Il componente obi-button rappresenta il pulsante standard per l'interazione nell'interfaccia utente.
Offre supporto integrato per icone prepend e append, differenti varianti grafiche (outlined, filled, elevated), palette cromatiche di rilevanza, stati di caricamento e animazione ripple al tocco.`,
                descrizione: "Esempio obi-button",
                codice: `<obi-button label='Salva' prepend='save' relevance='primary'></obi-button>
<obi-button label='Annulla' variant='outlined'></obi-button>
<obi-button icon prepend='delete' relevance='danger'></obi-button>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>label</strong>[string]: Testo visualizzato sul pulsante</li>
                    <li><strong>prepend</strong>[string]: Nome dell'icona Material Symbols visualizzata prima dell'etichetta</li>
                    <li><strong>append</strong>[string]: Nome dell'icona Material Symbols visualizzata dopo l'etichetta</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>variant</strong>['outlined', 'filled', 'elevated']: Stile grafico del pulsante</li>
                    <li><strong>relevance</strong>['brand', 'primary', 'secondary', 'tertiary', 'neutral', 'danger', 'warning', 'success', 'info']: Livello cromatico di rilevanza</li>
                    <li><strong>size</strong>['xs', 'sm', 'md', 'lg', 'xl', 'xxl']: Dimensione del pulsante e dei relativi elementi interni</li>
                    <li><strong>icon</strong>: Trasforma il pulsante in un cerchio compatto adatto a contenere un'icona singola</li>
                    <li><strong>link</strong>: Rende il pulsante trasparente e con stile collegamento ipertestuale</li>
                    <li><strong>disabled</strong>: Disabilita l'interazione e applica lo stile disattivato</li>
                    <li><strong>loading</strong>['0' | '1']: Mostra uno spinner animato di caricamento</li>
                </ul>
                `
            }
        ]
    },
    //input.textbox
    {
        id: "comp.input.textbox",
        nome: "Componenti: OBI-TEXTBOX",
        source: `${BASE_URL}/components/input/obi-textbox.js`,
        sezioni: [
            {
                titolo: "Il componente obi-textbox",
                note: `Il componente obi-textbox è il campo di testo standard dell'interfaccia.
Fornisce etichette animate fluttuanti, gestione di prefissi e suffissi, maschere di formattazione automatiche, filtraggio caratteri, contatore di caratteri e validazione integrata.`,
                descrizione: "Esempio obi-textbox",
                codice: `<obi-textbox placeholder='Inserisci il nome' required></obi-textbox>
<obi-textbox label='Telefono' format='###-#######' icon='phone'></obi-textbox>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>label</strong>[string]: Etichetta fluttuante del campo di testo</li>
                    <li><strong>valore</strong>[any]: Valore testuale o numerico del campo</li>
                    <li><strong>messaggio</strong>[string]: Testo di supporto o messaggio di validazione mostrato sotto il campo</li>
                    <li><strong>prepend</strong>[string]: Testo o icona anteposto all'input</li>
                    <li><strong>append</strong>[string]: Testo o icona posposto all'input</li>
                    <li><strong>placeholder</strong>[string]: Testo segnaposto visualizzato quando il campo è vuoto</li>
                    <li><strong>type</strong>[string]: Tipo HTML del campo ('text', 'password', 'number', 'prenotazione', 'offerta', ecc.)</li>
                    <li><strong>filter</strong>[RegExp]: Espressione regolare utilizzata per filtrare i caratteri inseriti</li>
                    <li><strong>pattern</strong>[string]: Espressione regolare per la validazione del formato del testo</li>
                    <li><strong>format</strong>[string]: Maschera di formattazione automatica dei caratteri (es. '##/##/####')</li>
                    <li><strong>max</strong>[number]: Valore massimo (per tipo numerico) o limite superiore</li>
                    <li><strong>min</strong>[number]: Valore minimo (per tipo numerico)</li>
                    <li><strong>count</strong>[number]: Numero massimo di caratteri per il conteggio e validazione</li>
                    <li><strong>disabled</strong>[boolean]: Disabilita l'input</li>
                    <li><strong>invalid</strong>[boolean]: Forza visivamente lo stato di campo non valido</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>value</strong>: Valore effettivo numerico o testuale ricavato dall'elemento di input nativo</li>
                    <li><strong>counter</strong>: Stringa del contatore dei caratteri (es. '5/20')</li>
                    <li><strong>isInvalid</strong>: Restituisce true se il valore corrente non soddisfa i requisiti di validità</li>
                    <li><strong>isEmpty</strong>: Restituisce true se il campo è vuoto o nullo</li>
                    <li><strong>required</strong>: Restituisce true se l'attributo 'required' è impostato</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>variant</strong>['filled', 'outlined']: Stile grafico del contenitore di testo</li>
                    <li><strong>disabled</strong>: Disabilita l'interazione con il campo</li>
                    <li><strong>required</strong>: Indica che la compilazione del campo è obbligatoria, aggiungendo un asterisco</li>
                    <li><strong>invalid</strong>: Imposta lo stile di errore con bordi ed etichette rossi</li>
                    <li><strong>text-align</strong>['center', 'end']: Allineamento orizzontale del testo nell'input</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>isValid()</strong>: Esegue il controllo di validità del campo verificando vincoli di lunghezza, formato e whitelist HTML</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>change</strong> -> <code>value</code>: Emesso quando il valore del campo viene modificato</li>
                    <li><strong>changed</strong> -> <code>value</code>: Emesso alla modifica del valore trasmettendo il nuovo valore</li>
                    <li><strong>keyup</strong> -> <code>evt, value</code>: Emesso al rilascio di un tasto con l'evento nativo e il valore attuale</li>
                    <li><strong>keydown</strong> -> <code>evt</code>: Emesso alla pressione di un tasto</li>
                </ul>
                `
            }
        ]
    },
    //input.textarea
    {
        id: "comp.input.textarea",
        nome: "Componenti: OBI-TEXTAREA",
        source: `${BASE_URL}/components/input/obi-textarea.js`,
        sezioni: [
            {
                titolo: "Il componente obi-textarea",
                note: `Il componente obi-textarea consente di inserire e modificare testo su più righe. Supporta testo formattato, elenchi puntati, numerati e checklist; include inoltre messaggi di supporto, placeholder e validazione del contenuto.`,
                descrizione: "Esempio obi-textarea",
                codice: `<obi-textarea
    placeholder='Scrivi una descrizione'
    messaggio='Puoi usare gli strumenti di formattazione'
    righe='5'
    enable-format
    required></obi-textarea>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>label</strong>[string]: Etichetta del campo</li>
                    <li><strong>valore</strong>[string]: Contenuto del testo, anche con formattazione HTML supportata</li>
                    <li><strong>messaggio</strong>[string]: Testo di supporto mostrato sotto il campo</li>
                    <li><strong>placeholder</strong>[string]: Testo mostrato quando il campo è vuoto</li>
                    <li><strong>righe</strong>[number]: Altezza iniziale del campo espressa in righe (default: 5)</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>value</strong>: Restituisce il contenuto corrente, convertito in numero se è un valore numerico</li>
                    <li><strong>required</strong>: Restituisce true se è presente l'attributo <code>required</code></li>
                    <li><strong>isDisabled</strong>: Restituisce true se il campo è disabilitato</li>
                    <li><strong>isFormattable</strong>: Restituisce true se è presente l'attributo <code>enable-format</code></li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>required</strong>: Indica che il campo è obbligatorio</li>
                    <li><strong>disabled</strong>: Disabilita la modifica del contenuto</li>
                    <li><strong>enable-format</strong>: Mostra gli strumenti per formattare il testo e creare elenchi</li>
                    <li><strong>format</strong>['email', 'multiemail', 'numeric', 'textual', 'date']: Applica una validazione del formato indicato</li>
                    <li><strong>count</strong>[number]: Limite massimo di caratteri</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>isValid()</strong>: Verifica il contenuto rispetto al formato e al limite di caratteri</li>
                    <li><strong>setList()</strong>: Converte le righe selezionate in un elenco puntato</li>
                    <li><strong>setNumericList()</strong>: Converte le righe selezionate in un elenco numerato</li>
                    <li><strong>setCheckList()</strong>: Converte le righe selezionate in una checklist</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>changed</strong> -> <code>value</code>: Emesso quando il contenuto viene modificato, trasmette il nuovo valore</li>
                    <li><strong>command</strong> -> <code>command</code>: Emesso quando viene elaborato un comando inline riconosciuto nel testo</li>
                </ul>
                `
            }
        ]
    },
    //input.checkbox
    {
        id: "comp.input.checkbox",
        nome: "Componenti: OBI-CHECKBOX",
        source: `${BASE_URL}/components/input/obi-checkbox.js`,
        sezioni: [
            {
                titolo: "Il componente obi-checkbox",
                note: `Il componente obi-checkbox consente la selezione di opzioni binarie (booleane).
Può essere presentato come casella di spunta classica, interruttore a levetta (toggle switch), radio button o pulsante selezionabile.`,
                descrizione: "Esempio obi-checkbox",
                codice: `<obi-checkbox label='Opzione Standard' :valore='true'></obi-checkbox>
<obi-checkbox label='Interruttore' toggle :valore='false'></obi-checkbox>
<obi-checkbox label='Radio Style' radio :valore='false'></obi-checkbox>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>label</strong>[string]: Testo dell'etichetta visualizzata accanto alla casella</li>
                    <li><strong>valore</strong>[boolean]: Stato booleano di selezione (true se attivo, false altrimenti)</li>
                    <li><strong>disabled</strong>[boolean]: Disabilita l'interazione con il componente</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>value</strong>: Restituisce lo stato booleano di spunta dell'input nativo</li>
                    <li><strong>required</strong>: Restituisce true se è presente l'attributo 'required'</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>disabled</strong>: Disabilita il componente impedendone la selezione</li>
                    <li><strong>toggle</strong>: Trasforma la casella di controllo in un interruttore a scorrimento (toggle)</li>
                    <li><strong>radio</strong>: Mostra il controllo con stile grafico radio button circolare</li>
                    <li><strong>button</strong>: Modella il controllo sotto forma di pulsante selezionabile</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>isValid()</strong>: Restituisce true per la validazione del componente</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>changed</strong> -> <code>boolean</code>: Emesso al cambio dello stato di selezione, trasmette il nuovo valore booleano</li>
                </ul>
                `
            }
        ]
    },
    //input.checkgroup
    {
        id: "comp.input.checkgroup",
        nome: "Componenti: OBI-CHECKGROUP",
        source: `${BASE_URL}/components/input/obi-checkgroup.js`,
        sezioni: [
            {
                titolo: "Il componente obi-checkgroup",
                note: `Il componente obi-checkgroup raccoglie un gruppo compatto di pulsanti collegati tra loro per consentire la selezione esclusiva di una singola opzione all'interno di un insieme predefinito.`,
                descrizione: "Esempio obi-checkgroup",
                codice: `<obi-checkgroup :opzioni='[{label: "Settimanale", value: 1}, {label: "Mensile", value: 2}, {label: "Annuale", value: 3}]' :valore='1'></obi-checkgroup>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>opzioni</strong>[{ label: string, value: any, icona?: string, title?: string }[]]: Elenco delle opzioni selezionabili</li>
                    <li><strong>valore</strong>[any]: Valore identificativo dell'opzione correntemente selezionata</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>value</strong>: Restituisce il valore attualmente selezionato</li>
                    <li><strong>required</strong>: Restituisce true se il controllo è obbligatorio</li>
                    <li><strong>relevance</strong>: Restituisce la rilevanza cromatica specificata dall'attributo (default: 'primary')</li>
                    <li><strong>disabled</strong>: Restituisce true se il controllo è disabilitato</li>
                    <li><strong>variant</strong>: Restituisce la variante grafica specificata</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>relevance</strong>['brand', 'primary', 'secondary', 'tertiary']: Rilevanza cromatica del pulsante attivo</li>
                    <li><strong>variant</strong>['outlined', 'filled', 'elevated']: Variante grafica dei pulsanti</li>
                    <li><strong>disabled</strong>: Disabilita tutti i pulsanti del gruppo</li>
                    <li><strong>required</strong>: Impone che un'opzione debba essere obbligatoriamente selezionata</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>isValid()</strong>: Verifica che sia stato selezionato un valore valido se il controllo è obbligatorio</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>changed</strong> -> <code>evt</code>: Emesso al cambio di opzione selezionata con l'evento di click</li>
                </ul>
                `
            }
        ]
    },
    //input.chiplist
    {
        id: "comp.input.chiplist",
        nome: "Componenti: OBI-CHIPLIST",
        source: `${BASE_URL}/components/input/obi-chiplist.js`,
        sezioni: [
            {
                titolo: "Il componente obi-chiplist",
                note: `Il componente obi-chiplist permette di inserire e gestire più valori all'interno di un unico campo. I valori selezionati vengono mostrati come chip rimovibili; l'utente può scegliere tra le opzioni suggerite oppure digitare un valore libero. Supporta valori iniziali sotto forma di array o stringa separata da un delimitatore.`,
                descrizione: "Esempio obi-chiplist",
                codice: `<obi-chiplist label='Partecipanti'
    :opzioni='[{label: "Ada", value: "ada"}, {label: "Luca", value: "luca"}]'
    :valore='["ada"]'
    placeholder='Aggiungi un partecipante'
    messaggio='Seleziona un nome o premi Invio'></obi-chiplist>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>label</strong>[string]: Etichetta del campo</li>
                    <li><strong>valore</strong>[array | string]: Valori selezionati; può essere un array oppure una stringa separata da <code>separatore</code></li>
                    <li><strong>opzioni</strong>[{ label: string, value: any }[]]: Opzioni suggerite e selezionabili</li>
                    <li><strong>placeholder</strong>[string]: Testo mostrato quando non ci sono valori</li>
                    <li><strong>messaggio</strong>[string]: Testo di supporto visualizzato sotto il campo</li>
                    <li><strong>separatore</strong>[string]: Carattere che conferma un valore digitato e separa i valori quando <code>valore</code> è una stringa (default: virgola)</li>
                    <li><strong>format</strong>: Opzione ricevuta dal componente, attualmente senza effetto dedicato</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>required</strong>: Rende obbligatorio inserire almeno un valore</li>
                    <li><strong>disabled</strong>: Disabilita l'inserimento e la rimozione dei valori</li>
                    <li><strong>not-select-all</strong>: Nasconde l'opzione per selezionare tutte le opzioni suggerite</li>
                    <li><strong>select-mode='single'</strong>: Limita i suggerimenti alle opzioni non ancora selezionate</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>getValue()</strong>: Restituisce i valori selezionati nel formato di <code>valore</code> (array o stringa)</li>
                    <li><strong>isValid()</strong>: Verifica i vincoli di obbligatorietà e validità del contenuto</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>changed</strong> -> <code>valore</code>: Emesso quando viene aggiunto o rimosso un valore</li>
                </ul>
                `
            }
        ]
    },
    //input.select
    {
        id: "comp.input.select",
        nome: "Componenti: OBI-SELECT",
        source: `${BASE_URL}/components/input/obi-select.js`,
        sezioni: [
            {
                titolo: "Il componente obi-select",
                note: `Il componente obi-select implementa un selettore a discesa avanzato per la scelta di un elemento da un elenco.
Fornisce etichette fluttuanti, ricerca rapida digitando dalla tastiera, indicatore di validità, icone prepend/append e messaggi di supporto.`,
                descrizione: "Esempio obi-select",
                codice: `<obi-select label='Regione' :opzioni='[{label: "Toscana", value: 1}, {label: "Lombardia", value: 2}]' :valore='1' required></obi-select>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>opzioni</strong>[{ label: string, value: any }[]]: Elenco delle opzioni selezionabili</li>
                    <li><strong>label</strong>[string]: Etichetta fluttuante del menu a discesa</li>
                    <li><strong>valore</strong>[any]: Valore identificativo dell'opzione selezionata</li>
                    <li><strong>messaggio</strong>[string]: Testo di supporto visualizzato sotto il selettore</li>
                    <li><strong>prepend</strong>[string]: Testo o icona anteposto all'etichetta</li>
                    <li><strong>append</strong>[string]: Testo o icona posposto all'etichetta</li>
                    <li><strong>placeholder</strong>[string]: Testo segnaposto mostrato se non vi è selezione</li>
                    <li><strong>disabled</strong>[boolean]: Disabilita il controllo</li>
                    <li><strong>icon</strong>[string]: Icona a fianco sinistro del titolo</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>selected</strong>: Restituisce l'etichetta testuale dell'opzione selezionata</li>
                    <li><strong>value</strong>: Restituisce il valore associato all'opzione selezionata</li>
                    <li><strong>required</strong>: Restituisce true se è presente l'attributo 'required'</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>variant</strong>['filled', 'outlined']: Stile grafico del menu a discesa</li>
                    <li><strong>disabled</strong>: Disabilita l'interazione con il selettore</li>
                    <li><strong>required</strong>: Rende obbligatoria la selezione di un valore valido</li>
                    <li><strong>valid</strong>: Applicato quando è selezionato un valore valido</li>
                    <li><strong>float-container</strong>['show', 'hide']: Stato di apertura del menu a comparsa delle opzioni</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>select(evt)</strong>: Seleziona l'opzione cliccata, aggiorna il valore ed emette l'evento changed</li>
                    <li><strong>isValid()</strong>: Verifica se il campo soddisfa il vincolo di selezione obbligatoria</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>changed</strong> -> <code>value</code>: Emesso alla variazione dell'opzione selezionata, trasmette il nuovo valore</li>
                </ul>
                `
            }
        ]
    },
    //input.combobox
    {
        id: "comp.input.combobox",
        nome: "Componenti: OBI-COMBOBOX",
        source: `${BASE_URL}/components/input/obi-combobox.js`,
        sezioni: [
            {
                titolo: "Il componente obi-combobox",
                note: `Il componente obi-combobox combina un campo di testo con un elenco di opzioni filtrabili. L'utente può digitare per cercare un'opzione e selezionarla dal menu; il componente mantiene separati il testo visualizzato e il valore associato all'opzione.`,
                descrizione: "Esempio obi-combobox",
                codice: `<obi-combobox label='Regione'
    :opzioni='[{label: "Toscana", value: 1}, {label: "Lombardia", value: 2}]'
    :valore='1'
    required></obi-combobox>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>opzioni</strong>[{ label: string, value: any }[]]: Elenco di opzioni da filtrare e selezionare</li>
                    <li><strong>label</strong>[string]: Etichetta del campo</li>
                    <li><strong>valore</strong>[any]: Valore associato all'opzione selezionata</li>
                    <li><strong>messaggio</strong>[string]: Testo di supporto visualizzato sotto il campo</li>
                    <li><strong>prepend</strong>[string]: Testo o icona visualizzato prima del campo</li>
                    <li><strong>append</strong>[string]: Testo o icona visualizzato dopo il campo</li>
                    <li><strong>placeholder</strong>[string]: Testo mostrato quando il campo è vuoto</li>
                    <li><strong>variant</strong>[string]: Variante grafica passata al campo di testo</li>
                    <li><strong>disabled</strong>[boolean]: Disabilita il controllo</li>
                    <li><strong>icon</strong>[string]: Icona visualizzata nel campo di testo</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>value</strong>: Restituisce il valore dell'opzione selezionata</li>
                    <li><strong>required</strong>: Restituisce true se è presente l'attributo <code>required</code></li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>required</strong>: Applica la validazione di campo obbligatorio</li>
                    <li><strong>disabled</strong>: Disabilita il campo e la selezione delle opzioni</li>
                    <li><strong>format</strong>['email', 'multiemail', 'numeric', 'textual', 'date']: Applica la validazione del formato indicato</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>isValid()</strong>: Verifica il valore rispetto agli attributi <code>required</code> e <code>format</code></li>
                    <li><strong>syncValue()</strong>: Sincronizza il testo visualizzato con l'opzione corrispondente al valore corrente</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>changed</strong> -> <code>value</code>: Emesso quando viene selezionata un'opzione, con il relativo valore</li>
                </ul>
                `
            }
        ]
    },
    //input.slider
    {
        id: "comp.input.slider",
        nome: "Componenti: OBI-SLIDER",
        source: `${BASE_URL}/components/input/obi-slider.js`,
        sezioni: [
            {
                titolo: "Il componente obi-slider",
                note: `Il componente obi-slider consente di scegliere un valore numerico continuo trascinando un cursore su una barra o digitandolo in un campo numerico sincronizzato.
Include avanzamento dinamico colorato, messaggi di supporto ed etichette descrittive.`,
                descrizione: "Esempio obi-slider",
                codice: `<obi-slider label='Sconto (%)' :valore='15' min='0' max='100'></obi-slider>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>label</strong>[string]: Etichetta testuale descrittiva dello slider</li>
                    <li><strong>valore</strong>[number]: Valore numerico corrente dello slider</li>
                    <li><strong>max</strong>[number]: Valore massimo consentito (default: 100)</li>
                    <li><strong>min</strong>[number]: Valore minimo consentito (default: 1)</li>
                    <li><strong>disabled</strong>[boolean]: Disabilita l'interazione con lo slider</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>value</strong>: Restituisce il valore numerico corrente</li>
                    <li><strong>required</strong>: Restituisce true se è presente l'attributo 'required'</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>disabled</strong>: Disabilita sia il cursore che il campo numerico</li>
                    <li><strong>required</strong>: Impone la presenza di un valore numerico valido</li>
                    <li><strong>clean</strong>: Nasconde il campo numerico laterale mostrando solo la barra</li>
                    <li><strong>progress</strong>: Visualizza la barra di avanzamento colorata fino al cursore</li>
                    <li><strong>thin</strong>: Riduce lo spessore della linea della barra</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>updateProgressBar()</strong>: Aggiorna le variabili CSS relative alla larghezza della barra e al punto cursore</li>
                    <li><strong>isValid()</strong>: Verifica che il valore sia valido rispetto ai vincoli</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>changed</strong> -> <code>number</code>: Emesso al cambio del valore, trasmette il nuovo valore numerico</li>
                </ul>
                `
            }
        ]
    },
    //input.datepicker
    {
        id: "comp.input.datepicker",
        nome: "Componenti: OBI-DATE",
        source: `${BASE_URL}/components/input/obi-date.js`,
        sezioni: [
            {
                titolo: "Il componente obi-date",
                note: `Il componente obi-date fornisce un selettore completo di data con campo di testo formattato (gg/mm/aaaa) e calendario popup interattivo.
Supporta la navigazione per mese e anno, selezione rapida della data odierna e validazione automatica del formato data.`,
                descrizione: "Esempio obi-date",
                codice: `<obi-date label='Data Documento' :valore='new Date()'></obi-date>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>valore</strong>[Date | string]: Data selezionata come oggetto Date o stringa valida</li>
                    <li><strong>label</strong>[string]: Etichetta fluttuante del campo</li>
                    <li><strong>disabled</strong>[boolean]: Disabilita il campo data</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>date_display</strong>: Restituisce la data di navigazione correntemente visualizzata nel calendario</li>
                    <li><strong>years</strong>: Array degli anni selezionabili (intervallo di 125 anni)</li>
                    <li><strong>month_display</strong>: Nome abbreviato del mese visualizzato</li>
                    <li><strong>year_display</strong>: Anno corrente visualizzato</li>
                    <li><strong>grid_days</strong>: Elenco dei giorni per comporre la griglia settimanale del mese</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>disabled</strong>: Disabilita l'interazione con il campo e l'apertura del calendario</li>
                    <li><strong>required</strong>: Rende obbligatoria la selezione di una data valida</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>update()</strong>: Sincronizza lo stato interno e formatta la data per l'anteprima testuale</li>
                    <li><strong>setDate(evt)</strong>: Imposta la data al click su un giorno della griglia ed emette changed</li>
                    <li><strong>setToday()</strong>: Imposta la data corrente odierna</li>
                    <li><strong>navigateDate(datetime)</strong>: Aggiorna la vista del calendario alla data indicata</li>
                    <li><strong>isValid()</strong>: Verifica la validità della data rispetto ai vincoli</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>changed</strong> -> <code>Date</code>: Emesso alla selezione o modifica della data con l'oggetto Date corrispondente</li>
                </ul>
                `
            }
        ]
    },
    //input.timepicker
    {
        id: "comp.input.timepicker",
        nome: "Componenti: OBI-TIME",
        source: `${BASE_URL}/components/input/obi-time.js`,
        sezioni: [
            {
                titolo: "Il componente obi-time",
                note: `Il componente obi-time permette la selezione e l'inserimento di un orario nel formato ore e minuti (hh:mm).
Integra campi numerici bidirezionali con un menu a scorrimento verticale per la scelta rapida di ore (00-23) e minuti (00-59).`,
                descrizione: "Esempio obi-time",
                codice: `<obi-time label='Orario Visita' valore='14:30'></obi-time>`,
                preview: true,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>valore</strong>[string]: Stringa dell'orario nel formato 'hh:mm'</li>
                    <li><strong>label</strong>[string]: Etichetta descrittiva del controllo</li>
                    <li><strong>disabled</strong>[boolean]: Disabilita il componente</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>hours</strong>: Array delle 24 ore ('00' - '23')</li>
                    <li><strong>minutes</strong>: Array dei 60 minuti ('00' - '59')</li>
                    <li><strong>complete</strong>: Restituisce true se sia l'ora che i minuti sono stati inseriti</li>
                    <li><strong>value</strong>: Restituisce il valore orario corrente</li>
                    <li><strong>required</strong>: Restituisce true se l'attributo 'required' è presente</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>disabled</strong>: Disabilita i campi numerici e l'apertura del selettore</li>
                    <li><strong>required</strong>: Rende obbligatorio l'inserimento dell'orario</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>setHour(evt)</strong>: Imposta l'ora selezionata ed emette l'evento changed</li>
                    <li><strong>setMinute(evt)</strong>: Imposta i minuti selezionati ed emette l'evento changed</li>
                    <li><strong>toTime()</strong>: Restituisce un oggetto contenente { hour, minutes }</li>
                    <li><strong>toString()</strong>: Converte l'orario corrente in stringa formattata 'hh:mm'</li>
                    <li><strong>isValid()</strong>: Verifica che l'orario sia completo se il campo è obbligatorio</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>changed</strong> -> <code>string</code>: Emesso al cambio di ora o minuti con la nuova stringa 'hh:mm'</li>
                </ul>
                `
            }
        ]
    },
    //input.filepicker
    {
        id: "comp.input.filepicker",
        nome: "Componenti: OBI-FILE",
        source: `${BASE_URL}/components/input/obi-file.js`,
        sezioni: [
            {
                titolo: "Il componente obi-file",
                note: `Il componente obi-file gestisce il caricamento e la gestione di file nell'applicazione.
Supporta il trascinamento drag-and-drop, selezione multipla, anteprima dei file caricati con rimozione singola, modalità icona compatta e integrazione di link a Google Drive.`,
                descrizione: "Esempio obi-file",
                codice: `<obi-file label='Carica Documenti' accept='.pdf,.docx' multiple></obi-file>`,
                preview: false,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>label</strong>[string]: Testo dell'etichetta del pulsante di selezione (default: 'Carica File')</li>
                    <li><strong>valore</strong>[any]: Buffer o array di buffer dei file caricati</li>
                    <li><strong>accept</strong>[string]: Tipi MIME o estensioni di file ammesse (es. '.pdf,image/*')</li>
                    <li><strong>relevance</strong>[string]: Rilevanza cromatica del pulsante (default: 'primary')</li>
                    <li><strong>variant</strong>[string]: Variante grafica del pulsante (default: 'filled')</li>
                    <li><strong>files</strong>[array]: Elenco dei file caricati con icone e metadati</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>isMultiple</strong>: Restituisce true se è presente l'attributo 'multiple'</li>
                    <li><strong>value</strong>: Restituisce il buffer del singolo file o array di buffer se multiplo</li>
                    <li><strong>required</strong>: Restituisce true se è presente l'attributo 'required'</li>
                    <li><strong>isIcon</strong>: Restituisce true se il componente è configurato con l'attributo 'icon'</li>
                    <li><strong>noDriveLink</strong>: Restituisce true se l'integrazione Google Drive è disabilitata da input-settings</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>disabled</strong>: Disabilita il caricamento dei file e l'area di rilascio</li>
                    <li><strong>multiple</strong>: Abilita il caricamento contemporaneo di più file</li>
                    <li><strong>required</strong>: Rende obbligatorio il caricamento di almeno un file</li>
                    <li><strong>invalid</strong>: Imposta lo stato visivo di errore</li>
                    <li><strong>icon</strong>: Mostra il componente come pulsante compatto con icona di allegato</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>searchFile(evt)</strong>: Apre la finestra di dialogo nativa per la selezione dei file</li>
                    <li><strong>addFile(input)</strong>: Elabora e codifica un nuovo file aggiungendolo alla lista</li>
                    <li><strong>addDriveFile()</strong>: Aggiunge un collegamento file collegato a un URL di Google Drive</li>
                    <li><strong>removeFile(evt)</strong>: Rimuove il file selezionato dall'elenco</li>
                    <li><strong>isValid()</strong>: Verifica se il controllo soddisfa i vincoli di obbligatorietà</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>added</strong> -> <code>files[]</code>: Emesso dopo l'aggiunta di file con l'elenco aggiornato</li>
                    <li><strong>removed</strong> -> <code>files[]</code>: Emesso alla cancellazione di un file con l'elenco aggiornato</li>
                </ul>
                `
            }
        ]
    },
    //navigazione.menu
    {
        id: "comp.navigazione.menu",
        nome: "Componenti: OBI-NAV",
        source: `${BASE_URL}/components/navigation/obi-nav.js`,
        sezioni: [
            {
                titolo: "Il componente obi-nav",
                note: `Il componente obi-nav è la barra di navigazione verticale principale dell'applicazione, posizionata all'interno dello slot 'navigation' di obi-app.
Ospita elementi nav-item con supporto a icone, badge di conteggio, evidenziazione dello stato attivo e animazioni di espansione al passaggio del mouse.`,
                descrizione: "Esempio obi-nav",
                codice: `<obi-nav>
    <nav-item link='#dashboard' icona='dashboard' titolo='Dashboard' attivo></nav-item>
    <nav-item link='#ordini' icona='shopping_cart' titolo='Ordini' badge='12'></nav-item>
</obi-nav>`,
                preview: false,
            },
            {
                titolo: "INPUTS",
                note: `Gli elementi <code>nav-item</code> interni supportano i seguenti input:
                <ul>
                    <li><strong>titolo</strong>[string]: Testo della voce di menu</li>
                    <li><strong>link</strong>[string]: URL o indirizzo di reindirizzamento al click</li>
                    <li><strong>icona</strong>[string]: Nome dell'icona Material Symbols associata</li>
                    <li><strong>logo</strong>[string]: Percorso o URL del logo alternativo all'icona</li>
                    <li><strong>badge</strong>[string | number]: Valore del badge di notifica</li>
                    <li><strong>attivo</strong>[boolean]: Indica se la voce è attualmente selezionata</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>dynamic</strong>: Attiva l'animazione di espansione e compressione automatica al passaggio del mouse</li>
                    <li><strong>collapsed</strong>: Imposta la barra di navigazione in modalità contratta mostrando solo le icone</li>
                    <li><strong>disabled</strong>: Disabilita le voci di navigazione interne</li>
                </ul>
                `
            }
        ]
    },
    //navigazione.tabs
    {
        id: "comp.navigazione.tabs",
        nome: "Componenti: OBI-TAB",
        source: `${BASE_URL}/components/navigation/obi-tabs.js`,
        sezioni: [
            {
                titolo: "Il componente obi-tab",
                note: `Il componente obi-tab gestisce la navigazione orizzontale a schede (tab-item).
Permette di suddividere i contenuti in viste multiple selezionabili, con supporto a icone, badge di conteggio, sincronizzazione con selettori di pagina ed animazioni ripple.`,
                descrizione: "Esempio obi-tab",
                codice: `<obi-tab>
    <tab-item titolo='Dettaglio' icona='info' selettore='tab1' attivo></tab-item>
    <tab-item titolo='Allegati' icona='attach_file' selettore='tab2' badge='4'></tab-item>
</obi-tab>`,
                preview: false,
            },
            {
                titolo: "INPUTS",
                note: `I componenti <code>tab-item</code> supportano i seguenti input:
                <ul>
                    <li><strong>titolo</strong>[string]: Etichetta testuale della scheda</li>
                    <li><strong>icona</strong>[string]: Nome dell'icona Material Symbols associata</li>
                    <li><strong>logo</strong>[string]: URL del logo immagine alternativo all'icona</li>
                    <li><strong>badge</strong>[string | number]: Valore numerico o testuale del badge</li>
                    <li><strong>link</strong>[string]: URL di navigazione collegato</li>
                    <li><strong>selettore</strong>[string]: Nome o identificatore della vista collegata per la sincronizzazione</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `Gli elementi <code>tab-item</code> espongono i seguenti parametri:
                <ul>
                    <li><strong>attivo</strong>: Restituisce true se la scheda corrisponde alla vista corrente o possiede l'attributo 'current'</li>
                    <li><strong>page</strong>: Restituisce il valore dell'attributo 'pagina' associato</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>variant</strong>['filled', 'outlined', 'elevated']: Stile grafico della barra delle schede</li>
                    <li><strong>size</strong>['xs', 'sm', 'md', 'lg', 'xl']: Dimensione delle schede e dei testi</li>
                    <li><strong>relevance</strong>['brand', 'primary', 'secondary']: Rilevanza cromatica della scheda attiva</li>
                    <li><strong>icon</strong>: Dispone la scheda con orientamento ottimizzato per la visualizzazione dell'icona</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `Gli elementi <code>tab-item</code> espongono la seguente funzione:
                <ul>
                    <li><strong>onChangeView()</strong>: Attiva la scheda selezionata, aggiorna il selettore e genera l'evento changed</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>changed</strong> -> <code>string</code>: Emesso al cambio di scheda attiva, trasmette l'identificatore della vista selezionata</li>
                </ul>
                `
            }
        ]
    },
    //navigazione.tree
    {
        id: "comp.navigazione.tree",
        nome: "Componenti: OBI-TREE",
        source: `${BASE_URL}/components/navigation/obi-tree.js`,
        sezioni: [
            {
                titolo: "Il componente obi-tree",
                note: `Il componente obi-tree consente la visualizzazione e navigazione di strutture dati gerarchiche ad albero.
Supporta nodi ricorsivi, icone personalizzate di inizio e fine, diverse modalità di selezione ed espansione (single, active, open) e gestione di azioni interattive al click sui nodi.`,
                descrizione: "Esempio obi-tree",
                codice: `<obi-tree :data='treeData' mode='single'></obi-tree>`,
                preview: false,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>data</strong>[object]: Oggetto gerarchico che descrive i nodi dell'albero ({ label: string, children?: array, action?: function, prepend?: string, append?: string, type?: string, active?: boolean, value?: any })</li>
                    <li><strong>mode</strong>['single' | 'active' | 'open']: Modalità di espansione e selezione ('single' mantiene aperto un solo percorso, 'open' espande tutti i nodi, 'active' evidenzia la foglia)</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>prepend</strong>: Icona o elemento iniziale del nodo</li>
                    <li><strong>append</strong>: Icona o elemento finale del nodo</li>
                    <li><strong>label</strong>: Etichetta testuale del nodo</li>
                    <li><strong>type</strong>: Tipologia del nodo ('root', 'node', 'leaf')</li>
                    <li><strong>active</strong>: Restituisce 'active' se il nodo è attualmente marcato come attivo</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>mode</strong>['single' | 'active' | 'open']: Configura il comportamento di navigazione ed espansione dei nodi</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>update()</strong>: Compila e rigenera il DOM dell'albero dai dati aggiornati</li>
                    <li><strong>nodeAction(evt)</strong>: Esegue l'azione associata al nodo cliccato e gestisce l'evento di selezione</li>
                    <li><strong>openNode(target)</strong>: Regola lo stato espanso, attivo o sfocato (blur) dei rami dell'albero in base al mode</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>nodeclick</strong> -> <code>{ evt, data }</code>: Emesso al click su un nodo con l'evento e l'oggetto dati del nodo</li>
                    <li><strong>action</strong> -> <code>node</code>: Emesso quando viene attivata l'azione associata a un nodo</li>
                    <li><strong>leafclick</strong> -> <code>node</code>: Emesso al click su una foglia terminale dell'albero</li>
                    <li><strong>rootclick</strong> -> <code>node</code>: Emesso al click sul nodo radice principale</li>
                </ul>
                `
            }
        ]
    },
    //navigazione.breadcrumbs
    {
        id: "comp.navigazione.breadcrumbs",
        nome: "Componenti: OBI-BREADCRUMBS",
        source: `${BASE_URL}/components/navigation/obi-breadcrumbs.js`,
        sezioni: [
            {
                titolo: "Il componente obi-breadcrumbs",
                note: `Il componente obi-breadcrumbs visualizza un percorso di navigazione gerarchico (briciole di pane) per indicare la posizione della vista corrente.
Permette il ritorno immediato alle pagine superiori tramite link e callback di azione personalizzate.`,
                descrizione: "Esempio obi-breadcrumbs",
                codice: `<obi-breadcrumbs :path='[{label: "Home", action: goHome}, {label: "Sezione", action: goSection}, {label: "Dettaglio"}]'></obi-breadcrumbs>`,
                preview: false,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>path</strong>[{ label: string, action?: function }[]]: Elenco ordinato degli elementi del percorso di navigazione</li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>size</strong>['xs', 'sm', 'md', 'lg', 'xl', 'xxl']: Dimensione del testo e dei separatori del percorso</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>navigate(page)</strong>: Esegue la funzione di navigazione definita nella proprietà 'action' della voce cliccata</li>
                </ul>
                `
            }
        ]
    },
    //navigazione.stepper
    {
        id: "comp.navigazione.stepper",
        nome: "Componenti: OBI-STEPPER",
        source: `${BASE_URL}/components/stepper/obi-stepper.js`,
        sezioni: [
            {
                titolo: "Il componente obi-stepper",
                note: `Il componente obi-stepper mostra le fasi di un processo in sequenza e indica quella attiva e lo stato delle altre. Può essere navigato tramite le funzioni next() e back(); con l'attributo interact le fasi sono anche selezionabili direttamente.`,
                descrizione: "Esempio obi-stepper",
                codice: `<obi-stepper :steps='[
    {id: "dati", label: "Dati", message: "Inserisci i dati", status: 0},
    {id: "riepilogo", label: "Riepilogo", message: "Controlla i dati", status: 0},
    {id: "conferma", label: "Conferma", message: "Completa la procedura", status: 0}
]' active='dati' interact></obi-stepper>

<!-- Avanza o torna indietro tramite il contesto virtual del componente. -->`,
                preview: false,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>steps</strong>[{ id: string, label: string, message?: string, status?: number }[]]: Fasi da visualizzare in ordine</li>
                    <li><strong>active</strong>[string]: ID della fase attiva</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>current</strong>: Indice della fase attiva nell'array <code>steps</code></li>
                    <li><strong>interactable</strong>: Restituisce true se è presente l'attributo <code>interact</code></li>
                </ul>
                `
            },
            {
                titolo: "ATTRIBUTI",
                note: `
                <ul>
                    <li><strong>interact</strong>: Consente di selezionare direttamente una fase cliccandola</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>next()</strong>: Segna la fase corrente come completata e avanza alla successiva</li>
                    <li><strong>back()</strong>: Torna alla fase precedente quando la fase corrente non è completata</li>
                    <li><strong>set(step)</strong>: Imposta la fase attiva usando il suo ID</li>
                    <li><strong>update()</strong>: Sincronizza l'indice corrente con l'ID della fase attiva</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>done</strong> -> <code>step</code>: Emesso da <code>next()</code> con i dati della fase corrente</li>
                    <li><strong>undone</strong> -> <code>step</code>: Emesso da <code>back()</code> con i dati della fase corrente</li>
                    <li><strong>changed</strong> -> <code>active, previous</code>: Emesso quando cambia la fase attiva, con il nuovo ID e quello precedente</li>
                </ul>
                `
            }
        ]
    },
    //navigazione.pager
    {
        id: "comp.navigazione.pager",
        nome: "Componenti: OBI-PAGER",
        source: `${BASE_URL}/components/navigation/obi-pager.js`,
        sezioni: [
            {
                titolo: "Il componente obi-pager",
                note: `Il componente obi-pager divide una lista di dati in pagine e visualizza i controlli per spostarsi tra le pagine. Consente di scegliere il numero di elementi per pagina e il numero massimo di pagine mostrate nel gruppo di navigazione.`,
                descrizione: "Esempio obi-pager",
                codice: `<obi-pager :dati='elementi' view='10' max='5'></obi-pager>

<!-- Leggi la pagina corrente con getSliceData() e reagisci all'evento moved. -->`,
                preview: false,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>dati</strong>[array]: Elenco di elementi da suddividere in pagine</li>
                    <li><strong>view</strong>[number]: Numero di elementi per pagina (default: 20)</li>
                    <li><strong>max</strong>[number]: Numero massimo di pagine visibili nel gruppo (default: 5)</li>
                </ul>
                `
            },
            {
                titolo: "PARAMETRI",
                note: `
                <ul>
                    <li><strong>counter</strong>: Numero totale di pagine calcolato in base ai dati e a <code>view</code></li>
                    <li><strong>pages</strong>: Indici delle pagine mostrate nel gruppo corrente</li>
                    <li><strong>page</strong>: Indice della pagina attiva, a partire da zero</li>
                    <li><strong>maxPages</strong>: Numero di pagine mostrate nel gruppo corrente</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>next()</strong>: Passa alla pagina successiva, tornando alla prima dopo l'ultima</li>
                    <li><strong>prev()</strong>: Passa alla pagina precedente, tornando all'ultima prima della prima</li>
                    <li><strong>moveTo(page)</strong>: Imposta la pagina attiva tramite indice zero-based</li>
                    <li><strong>nextPager()</strong>: Mostra il gruppo successivo di pagine</li>
                    <li><strong>prevPager()</strong>: Mostra il gruppo precedente di pagine</li>
                    <li><strong>getSliceData()</strong>: Restituisce gli elementi di <code>dati</code> relativi alla pagina attiva</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>moved</strong> -> <code>page</code>: Emesso quando cambia pagina, con il nuovo indice zero-based</li>
                </ul>
                `
            }
        ]
    },
];

const navigazione =
{
    docs: {
        label: "Documentazione",
        active: true,
        children: [
            {
                value: "docs.lampredotto",
                label: "Lampredotto JS",
                action: function (target) { target.__node.parent.context.navigate(this.value); },
                children: [
                    {
                        value: "docs.lampredotto.render",
                        label: "RENDER MODULE",
                        action: function (target) { target.__node.parent.context.navigate(this.value); },
                        children: [
                            {
                                value: "docs.lampredotto.render.applicazione",
                                label: "Applicazione",
                                action: function (target) { target.__node.parent.context.navigate(this.value); },
                            },
                            {
                                value: "docs.lampredotto.render.comandi",
                                label: "Comandi",
                                action: function (target) { target.__node.parent.context.navigate(this.value); },
                                children: [
                                    {
                                        value: "docs.lampredotto.render.comandi.model", label: "model", action: function (target) {
                                            target.__node.parent.context.navigate(this.value);
                                        },
                                    },
                                    {
                                        value: "docs.lampredotto.render.comandi.on", label: "on", action: function (target) {
                                            target.__node.parent.context.navigate(this.value);
                                        },
                                    },
                                    {
                                        value: "docs.lampredotto.render.comandi.bind", label: "bind", action: function (target) {
                                            target.__node.parent.context.navigate(this.value);
                                        },
                                    },
                                    {
                                        value: "docs.lampredotto.render.comandi.for", label: "for", action: function (target) {
                                            target.__node.parent.context.navigate(this.value);
                                        },
                                    },
                                    {
                                        value: "docs.lampredotto.render.comandi.if", label: "if", action: function (target) {
                                            target.__node.parent.context.navigate(this.value);
                                        },
                                    },
                                ]
                            },
                            {
                                value: "docs.lampredotto.render.componenti", label: "Componenti", action: function (target) {
                                    target.__node.parent.context.navigate(this.value);
                                },
                            },
                            {
                                value: "docs.lampredotto.render.impostazioni", label: "Impostazioni", action: function (target) {
                                    target.__node.parent.context.navigate(this.value);
                                },
                            },
                            {
                                value: "docs.lampredotto.render.utility", label: "Utilità", action: function (target) {
                                    target.__node.parent.context.navigate(this.value);
                                },
                            },
                        ]
                    },
                    {
                        value: "docs.lampredotto.server",
                        label: "SERVER MODULE",
                        action: function (target) { target.__node.parent.context.navigate(this.value); },
                    },
                    {
                        value: "docs.lampredotto.user",
                        label: "USER MODULE",
                        action: function (target) { target.__node.parent.context.navigate(this.value); },
                    }
                ],
            },
            {
                value: "docs.components",
                label: "OBI Components",
                action: function (target) { target.__node.parent.context.navigate(this.value); },
                active: true,
                children: [
                    {
                        value: "docs.components.script", label: "Funzioni", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "docs.components.stili", label: "Stili", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "docs.components.servizi", label: "Servizi", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                ],
            },
        ],
    },
    obicomponents: {
        label: "OBI Components",
        active: true,
        children: [
            {
                value: "comp.login",
                label: "Login",
                prepend: "login",
                active: true,
                action: function (target) {
                    target.__node.parent.context.navigate(this.value);
                },
            },
            //APPLICAZIONE
            {
                value: "comp.applicazione",
                label: "Applicazione",
                prepend: "home",
                action: function (target) {
                    target.__node.parent.context.navigate(this.value);
                },
                children: [
                    {
                        value: "comp.applicazione.header",
                        label: "Header",
                        prepend: "foundation",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        }
                    },
                    {
                        value: "comp.applicazione.search",
                        label: "Search",
                        prepend: "search",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        }
                    },
                    {
                        value: "comp.applicazione.tool",
                        label: "Tool",
                        prepend: "stop_circle",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        }
                    },
                    {
                        value: "comp.applicazione.info",
                        label: "Info",
                        prepend: "help",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        }
                    },
                    {
                        value: "comp.applicazione.settings",
                        label: "Settings",
                        prepend: "settings",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        }
                    },
                    {
                        value: "comp.applicazione.user",
                        label: "User",
                        prepend: "person",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        }
                    },
                ],
            },
            //INTERFACCIA
            {
                value: "comp.interfaccia",
                label: "Interfaccia",
                children: [
                    {
                        value: "comp.interfaccia.currency",
                        label: "Currency",
                        prepend: "euro",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.interfaccia.chip",
                        label: "Chip",
                        prepend: "chips",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.interfaccia.cover",
                        label: "Cover",
                        prepend: "image",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.interfaccia.icon",
                        label: "Icona e Logo",
                        prepend: "circle",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.interfaccia.title",
                        label: "Titolo",
                        prepend: "format_size",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.interfaccia.headline",
                        label: "Headline",
                        prepend: "format_size",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.interfaccia.alert",
                        label: "Alert",
                        prepend: "position_bottom_right",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.interfaccia.card",
                        label: "Card",
                        prepend: "clarify",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                        children: [
                            {
                                value: "comp.interfaccia.card.header",
                                label: "Header",
                                prepend: "web_asset",
                                action: function (target) {
                                    target.__node.parent.context.navigate(this.value);
                                }
                            },
                            {
                                value: "comp.interfaccia.card.body",
                                label: "Body",
                                prepend: "capture",
                                action: function (target) {
                                    target.__node.parent.context.navigate(this.value);
                                }
                            },
                            {
                                value: "comp.interfaccia.card.action",
                                label: "Action",
                                prepend: "dock_to_bottom",
                                action: function (target) {
                                    target.__node.parent.context.navigate(this.value);
                                }
                            },
                            {
                                value: "comp.interfaccia.card.file",
                                label: "File",
                                prepend: "draft",
                                action: function (target) {
                                    target.__node.parent.context.navigate(this.value);
                                }
                            },
                        ]
                    },
                    {
                        value: "comp.interfaccia.modal",
                        label: "Modal",
                        prepend: "dialogs",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.interfaccia.badge",
                        label: "Badge",
                        prepend: "app_badging",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.interfaccia.sideview",
                        label: "SideView",
                        prepend: "side_navigation",
                        action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                ]
            },
            //DATI
            {
                value: "comp.dati",
                label: "Dati",
                children: [
                    {
                        value: "comp.dati.tabella", label: "Tabella", prepend: "table", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.dati.lista", label: "Lista", prepend: "list", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.dati.form", label: "Form", prepend: "edit_note", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.dati.email", label: "Email", prepend: "mail", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.dati.label", label: "Label", prepend: "segment", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.dati.chat", label: "Chat", prepend: "comment", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                ]
            },
            //INPUT
            {
                value: "comp.input",
                label: "Input",
                children: [
                    {
                        value: "comp.input.button", label: "Button", prepend: "crop_16_9", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.input.textbox", label: "Textbox", prepend: "title", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.input.textarea", label: "Textarea", prepend: "title", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.input.checkbox", label: "Checkbox", prepend: "check_box", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.input.checkgroup", label: "Checkgroup", prepend: "check_box", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.input.chiplist", label: "Chiplist", prepend: "variables", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.input.select", label: "Select", prepend: "lists", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.input.combobox", label: "Combobox", prepend: "lists", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.input.slider", label: "Slider", prepend: "sliders", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.input.datepicker", label: "Datepicker", prepend: "calendar_today", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.input.timepicker", label: "Timepicker", prepend: "schedule", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.input.filepicker", label: "Filepicker", prepend: "upload_file", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                ]
            },
            //NAVIGAZIONE
            {
                value: "comp.navigazione",
                label: "Navigazione",
                children: [
                    {
                        value: "comp.navigazione.menu", label: "Menu", prepend: "menu", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.navigazione.tabs", label: "Tabs", prepend: "more_horiz", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.navigazione.tree", label: "Tree", prepend: "account_tree", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.navigazione.breadcrumbs", label: "Breadcrumbs", prepend: "step", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.navigazione.stepper", label: "Stepper", prepend: "timeline", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                    {
                        value: "comp.navigazione.pager", label: "Pager", prepend: "dataset", action: function (target) {
                            target.__node.parent.context.navigate(this.value);
                        },
                    },
                ]
            },
        ],
    },
}

export { documentazione, navigazione };
