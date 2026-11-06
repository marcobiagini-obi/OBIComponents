import { BASE_URL } from "../../../obi.config.js";

export default {
    id: "docs.lampredotto.render",
    nome: "Modulo di Rendering",
    sezioni: [
        {
            titolo: "Introduzione al RenderModule",
            descrizione: null,
            note: `
<strong>RenderModule</strong> è il modulo di <strong>LAMP</strong> utilizzato per definire e rendere dinamica l'interfaccia dell'applicativo web.
Con le sue funzioni permette di legare i dati del <code>javascript</code> agli elementi grafici grazie a diversi strumenti:
<ul>
    <li><mark>Applicazioni</mark>: Contenitori dei dati e delle funzioni javascript, permettono l'allacciamento dei dati ai componenti grafici</li>
    <li><mark>Comandi di Rendering</mark>: Attributi <code>HTML</code> personalizzati che permettono la stampa a schermo dell'elaborazione dei dati</li>
    <li><mark>Componenti</mark>: Sottocontenitori dell'applicazione che hanno la funzione di frammentare il codice per evitare la duplicazione</li>
</ul>`,
            codice: null,
        },
        {
            titolo: "Come funziona il Modulo Rendering",
            descrizione: "Usare RenderModule",
            note: `
Lo strumento di accesso alle funzioni del motore di rendering si chiama <mark>RenderEngine</mark> ed essendo una classe singleton si può crearne un'istanza solo richiamando la proprietà <code>instance</code>

La classe RenderEngine ha solo la funzione <code>start(id: <span type>string</span>)</code> che permette di avviare una nuova <a href='#' @click='$.navigate("docs.lampredotto.render.applicazione")'><mark>Applicazione</mark></a> sull'elemento HTML con l'attributo id corrispondente.  
Il comando <code>start</code> restituisce un <mark>ApplicationBuilder</mark> che consente di gestire le applicazioni tramite le seguenti funzioni:
<ul>
    <li><code><strong>build(options: <span type>object</span>)</strong></code>: permette di definire il contesto dei dati attraverso il quale lavora l'applicazione, restituisce una classe Application</li>
    <li><code><strong>update(options: <span type>object</span>)</strong></code>: permette di aggiornare il contesto dei dati attraverso il quale lavora l'applicazione, restituisce una classe Application</li>
    <li><code><strong>dismiss()</strong></code>: rimuove l'applicazione</li>
</ul>
                                    `,
            codice: `
//importare l'oggetto RenderEngine permette l'accesso alle funzioni principali del modulo rendering
import RenderEngine from "${BASE_URL}/LAMP/RenderModule/LampRender.js";

//inizializzare il builder per avviare l'applicazione.
var builder = RenderEngine.instance.start("id_applicazione");

//impostare i parametri dell'applicazione.
builder.build(parametri: object);
`,
        },
    ]
}