import { BASE_URL } from "../../../obi.config.js";

export default {
    id: "docs.components.script",
    nome: "Funzioni di Utilità",
    sezioni: [
        {
            titolo: "Core JS",
            note: `il file core.js è un raccoglitore di funzioni utili allo sviluppo con OBIComponents`,
            descrizione: "Importazione di core.js",
            codice: `import { } from "${BASE_URL}/core.js"`,
        },
        {
            titolo: "Messaggi all'utente",
            note: `Con questa funzione è possibile far apparire dei messaggi a schermo per lasciare un feedback all'utente.`,
            descrizione: "Esempio alert di eccezione",
            codice: `import { obiAlert } from "${BASE_URL}/core.js";
try {
    //your code here
} catch (ex) {
    obiAlert(ex.message, { type: "error" }, ex);
}
            `,
        },
        {
            titolo: "",
            note: `la funzione obiAlert ha tre parametri:
            <ul>
                <li>messaggio: testo del messaggio</li>
                <li>opzioni[opzionale]: le opzioni possono indicare
                    <ul>
                        <li>type: "log", "success", "warning", "error" o "debug"</li>
                        <li>timer: di default a 3s, se uguale a zero il messaggio deve essere chiuso dall'utente</li>
                        <li>actions: [{ name: string, action: () => void, attributes: {} }]</li>
                    </ul>
                </li>
                <li>eccezione[opzionale]: se viene indicata un'eccezione viene predisposta un'azione di segnalazione all'IT del problema</li>
            </ul>
            <blockquote>
                <strong text-color='info'>NOTA BENE</strong>
                Gli attributi delle action sono attributi html e vanno definite come proprietà dell'oggetto con i rispettivi valori.
            </blockquote>

            Esempi di applicazione di obiAlert nella documentazione dei componenti.
            `,
        },
        {
            titolo: "Animazioni di caricamento",
            note: `Con la funzione obiLoader è possibile legare un processo ad un'animazione di caricamento su uno o più elementi della pagina.
            
            Questa funzione supporta due parametri, la action in questione ed una lista di elementi da animare.

            Per animare il componente è necessario ottenerne il nodo virtuale.
            Ci sono due tipi di animazione: <mark>a barra di caricamento</mark> e tramite <mark>skeleton</mark>.
            Per animare un oggetto con la barra di caricamento basta indicare il suo nodo virtuale, mentre per lo scheleton è necessario indicare un oggetto

            <code>{ vnode: vnode, skeleton: string }</code>

            Gli skeleton possono essere ["default", "button", "table", "input", "list"]
            `,
            descrizione: "Esempio applicazione obiLoader",
            codice: `import { obiLoader } from "${BASE_URL}/core.js";

async function loadDati(){
    var tabella = document.getElementById("tabella");
    var tasto = document.getElementById("tasto");
    return await obiLoader(async function() { return await apiFunction(); }, tabella.virtual, { target: tasto.virtual, type: "default" });         
}
            `,
        },
        {
            titolo: "Caricamento Dati Asincrono",
            note: `asyncDataLoader è un evento predisposto per catturare lo stato "mounted" dell'applicazione o di un componente per poter eseguire comodamente processi che richiedono tempo in asincrono.
            Utile ad esempio per scaricare dati dal server senza interrompere il rendering.`,
            descrizione: "",
            codice: `import { asyncDataLoader } from "${BASE_URL}/core.js";

const options = {
    dataset: {
        listaDati: [],
    },
    events:[
        asyncDataLoader.call(this, async function(){
            this.listaDati = await scaricaDati();
        }),
    ],
};`,
        },
        {
            titolo: "Altre Funzioni",
            note: ``,
            descrizione: "",
            codice: `
//Formatta le date in formato gg/mm/aaaa
obiStampDate(datetime);
            
//Restituisce l'url in base a se il sito viene eseguito in locale o sul server
dynamicUrl(serverUrl, localUrl);
            `,
        },
    ]
}