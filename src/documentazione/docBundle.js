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
                titolo: "EVENTI",
                note: `
                <ul>
                    <li><strong>@login</strong> -> <code>{ username: string, password: string }</code></li>
                </ul>
                `
            }
        ]
    },
    //applicazione
    {
        id: "comp.applicazione",
        nome: "Componenti: OBI-APP",
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
                <li><strong>label</strong>: il nome dell'impostazione</li>
                <li><strong>icona</strong>: L'icona dell'impostazione</li>
                </ul>`,
            }
        ],
    },
    //applicazione.user
    {
        id: "comp.applicazione.user",
        nome: "Applicazione: APP-USER",
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
                titolo: "EVENTI",
                note: `
                <ul>
                    <li><strong>@logout</strong> -> <code>object</code>: Chiama una funzione di logout passando i dati dell'utente loggato</li>
                    <li><strong>@edit</strong> -> <code>object</code>: Chiama una funzione di modifica passando i dati dell'utente loggato</li>
                </ul>
                `
            }
        ],
    },
    //intercaccia.currency
    {
        id: "comp.interfaccia.currency",
        nome: "Componenti: OBI-CURRENCY",
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
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>open</strong>: Fa apparire il modale</li>
                    <li><strong>close</strong>: chiude il modale</li>
                    <li><strong>toggle</strong>: Fa apparire e chiude il modale in base allo stato di visibilità</li>
                </ul>
                `
            }
        ]
    },
    //interfaccia.badge
    {
        id: "comp.interfaccia.badge",
        nome: "Componenti: OBI-BADGE",
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
        sezioni: [
            {
                titolo: "Il componente obi-sideview",
                note: `Il componente sideview permette di racchiudere un contenuto della pagina in un elemento a scomparsa verticale.
                Questo componente è utile per contenere ad esempio una sezione dedicata ai dettagli o messaggi
                `,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>display</strong>[boolean]: fa apparire o meno il componente</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>open</strong>: fa apparire il componente</li>
                    <li><strong>close</strong>: chiude il componente</li>
                    <li><strong>toggle</strong>: scambia aperto o chiuso a seconda dello stato di visualizzazione</li>
                </ul>
                `
            }
        ]
    },
    //dati.table
    {
        id: "comp.dati.tabella",
        nome: "Componenti: OBI-TABLE",
        sezioni: [
            {
                titolo: "Il componente obi-table",
                note: `Il componente obi-table è costruito per mostrare a schermo liste di dati sotto forma di tabella.
All'interno è compreso un sistema di impaginazione dei dati automatigo basato sul numero di righe.

I dati che vengono passate al componente obi-table vengono duplicati e salvati nello storage per questioni di ottimizzazione. Per lo stesso motivo le righe stampate all'interno non sono legate dinamicamente ai dati del componente, questo comporta che eventuali componenti dinamici all'interno delle righe non saranno legati ai dati direttamente e per aggiornare la vista è necessario richiamare la funzione update().
                `,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong>dati</strong>[array]: Lista di dati da renderizzare</li>
                    <li><strong>colonne</strong>[string[] | {nome: string, valore: string, type: string, format: function(value)}[]]: Lista di oggetti che descrivono i parametri degli oggetti nella lista dei dati che devono essere stampati a schermo</li>
                    <li><strong>chiave</strong>[string]: nome della proprietà identificativa della singola riga, se valorizzata permette il click sulla riga</li>
                    <li><strong>ordine</strong>[string]: nome della proprietà che ordina la lista. Questa proprietà comandata dalle intestazioni delle colonne</li>
                    <li><strong>filtro</strong>[object]: oggetto che contiene le proprietà dei dati da filtrare con i relativi valori</li>
                    <li><strong>righe</strong>[array]: numero di righe da visualizzare</li>
                </ul>
                `
            },
            {
                titolo: "FUNZIONI",
                note: `
                <ul>
                    <li><strong>update()</strong>: Aggiorna la vista dei dati </li>
                    <li><strong>addFilter(object)</strong>: Aggiunge un oggetto filtro ed aggiorna la tabella</li>
                    <li><strong>removeFilter(object)</strong>: Rimuove gli oggetti filtro con la proprietà e valore corrispondente ed aggiorna la tabella, se non viene specificato nulla rimuove tutti i filtri.</li>
                    <li><strong>cleanFilter()</strong>: Rimuove tutti i filtri ed aggiorna la tabella</li>
                    <li><strong>export(filename: string, options: {labels: string[], displayLabels: boolean, cleanData: boolean})</strong>: Esporta i dati filtrati e ordinati in csv</li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong>filtro</strong>: Inserisce eventuali form per i filtri sopra la lista delle intestazioni di colonna.</li>
                </ul>
                `
            },
            {
                titolo: "EVENTS",
                note: `
                <ul>
                    <li><strong>rowclick</strong>: Evento al click sulla riga, viene all'azione il dato corrispondente.</li>
                </ul>
                `
            }
        ]
    },
    //dati.lista
    {
        id: "comp.dati.lista",
        nome: "Componenti: OBI-LIST",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.dati.form",
        nome: "Componenti: OBI-FORM",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.dati.chat",
        nome: "Componenti: OBI-CHAT",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.input.button",
        nome: "Componenti: OBI-BUTTON",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.input.textbox",
        nome: "Componenti: OBI-TEXTBOX",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.input.checkbox",
        nome: "Componenti: OBI-CHECKBOX",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.input.checkgroup",
        nome: "Componenti: OBI-CHECKGROUP",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.input.select",
        nome: "Componenti: OBI-SELECT",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.input.slider",
        nome: "Componenti: OBI-SLIDER",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.input.datepicker",
        nome: "Componenti: OBI-DATE",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.input.timepicker",
        nome: "Componenti: OBI-TIME",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.input.filepicker",
        nome: "Componenti: OBI-FILE",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.navigazione.menu",
        nome: "Componenti: OBI-NAV",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.navigazione.tabs",
        nome: "Componenti: OBI-TAB",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.navigazione.tree",
        nome: "Componenti: OBI-TREE",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
                </ul>
                `
            }
        ]
    },
    {
        id: "comp.navigazione.breadcrumbs",
        nome: "Componenti: OBI-BREADCRUMBS",
        sezioni: [
            {
                titolo: "",
                descrizione: ``,
            },
            {
                titolo: "INPUTS",
                note: `
                <ul>
                    <li><strong></strong>[]: </li>
                </ul>
                `
            },
            {
                titolo: "SLOTS",
                note: `
                <ul>
                    <li><strong></strong>: </li>
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
                        value: "comp.input.select", label: "Select", prepend: "lists", action: function (target) {
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
                ]
            },
        ],
    },
}

export { documentazione, navigazione };