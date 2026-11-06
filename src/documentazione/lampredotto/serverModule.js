import { BASE_URL } from "../../../obi.config.js";

export default
    {
        id: "docs.lampredotto.server",
        nome: "Modulo di Connessione al Server",
        sezioni: [
            {
                titolo: "Introduzione al Server Module",
                note: `<strong>ServerModule</strong> è il modulo di <strong>LAMP</strong> dedicato alla connessione e allo scambio dati col server.
Il modulo è basato sulla <mark><a href='https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch' target='__blank'>Fetch API</a></mark> di Javascript e ne fa sostanzialmente da interfaccia utilizzando il pattern Singleton`,
                descrizione: null,
                codice: null,
            },
            {
                titolo: "GET",
                note: `Il tipo di chiamata GET permette di <mark>scaricare i dati del server</mark>.

<quote>Metodo API Fetch equivalente</quote>

<code rounded padding='sm' style='background-color: #121212; color: #9f9f9f'><span type>const</span> response = <span keyword>await</span> <span function>fetch</span><span brackets>(</span>url, <span brackets>{</span> <span function>method:</span> <span string>"GET"</span> <span brackets>}</span><span brackets>)</span>;</code>
                `,
                descrizione: "Esempio Chiamata GET",
                codice: `
import Service from "${BASE_URL}/LAMP/ServerModule/LampService.js";
import { obiAlert } from "${BASE_URL}/core.js";

const url = "http://myserver/applicationName/controller";

async function readData(){
    return await Service.instance.get(url).then(response => response.json()).catch(ex => obiAlert(ex, { type: "error" }));
}
                `,
            },
            {
                titolo: "",
                note: `La <strong>chiamata GET</strong>, come tutte le altre, si risolve in un oggetto <mark>response</mark> col contenuto della risponsa del server che può essere convertito in diversi modi.
                Nelle API Fetch è necessario, come nell'esempio sopra, richiamare le funzioni asincrone <span function>.json()</span> o <span function>.text()</span> ad esempio, per ottenere il formato desiderato.
                Il Server Module di Lampredotto invece mette a disposizione dei metodi diretti per la conversione del dato.`,
                descrizione: "Altri Metoti GET",
                codice: `import Service from "${BASE_URL}/LAMP/ServerModule/LampService.js";
import { obiAlert } from "${BASE_URL}/core.js";

const url = "http://myserver/applicationName/controller";

//Elabora i dati del server nel formato JSON, utile per i dati
async function readDataJson(){
    return await Service.instance.getJson(url).catch(ex => obiAlert(ex, { type: "error" }));
}
//Legge il corpo del response come testo
async function readDataText(){
    return await Service.instance.getText(url).catch(ex => obiAlert(ex, { type: "error" }));
}
//Restituisce un ObjectURL, utile per i file
async function readDataUrl(){
    return await Service.instance.getObjectUrl(url).catch(ex => obiAlert(ex, { type: "error" }));
}
async function readDataBlob(){
    return await Service.instance.getBlob(url).catch(ex => obiAlert(ex, { type: "error" }));
}
async function readDataArrayBuffer(){
    return await Service.instance.getArrayBuffer(url).catch(ex => obiAlert(ex, { type: "error" }));
}
                `,
            },
            {
                titolo: "POST",
                note: `Il tipo di chiamata POST permette di <mark>caricare i dati sul server</mark>.
Solitamente è usato per eseguire gli aggiornamenti dei dati.

<quote>Metodo API Fetch equivalente</quote>

<code rounded padding='sm' style='background-color: #121212; color: #9f9f9f'><span type>const</span> response = <span keyword>await</span> <span function>fetch</span><span brackets>(</span>url, <span brackets>{</span> <span function>method:</span> <span string>"POST"</span>, <span function>body:</span> JSON.stringify<span brackets>(</span>data<span brackets>)</span> <span brackets>}</span><span brackets>)</span>;</code>`,
                descrizione: "Esempio Chiamata POST",
                codice: `
import Service from "${BASE_URL}/LAMP/ServerModule/LampService.js";
import { obiAlert } from "${BASE_URL}/core.js";

const url = "http://myserver/applicationName/controller";

async function updateData(data){
    return await Service.instance.post(url, data).catch(ex => obiAlert(ex, { type: "error" }));
}
                `,
            },
            {
                titolo: "PUT",
                note: `Il tipo di chiamata PUT permette di <mark>caricare i dati sul server</mark>.
Solitamente è usato per eseguire gli inserimenti dei dati.

<quote>Metodo API Fetch equivalente</quote>

<code rounded padding='sm' style='background-color: #121212; color: #9f9f9f'><span type>const</span> response = <span keyword>await</span> <span function>fetch</span><span brackets>(</span>url, <span brackets>{</span> <span function>method:</span> <span string>"PUT"</span>, <span function>body:</span> JSON.stringify<span brackets>(</span>data<span brackets>)</span> <span brackets>}</span><span brackets>)</span>;</code>`,
                descrizione: "Esempio Chiamata PUT",
                codice: `
import Service from "${BASE_URL}/LAMP/ServerModule/LampService.js";
import { obiAlert } from "${BASE_URL}/core.js";

const url = "http://myserver/applicationName/controller";

async function insertData(data){
    return await Service.instance.put(url, data).catch(ex => obiAlert(ex, { type: "error" }));
}
                `,
            },
            {
                titolo: "DELETE",
                note: `Il tipo di chiamata DELETE permette di <mark>interagire col server</mark>.
                Generalmente indicato per la rimozione dei dati.

<quote>Metodo API Fetch equivalente</quote>

<code rounded padding='sm' style='background-color: #121212; color: #9f9f9f'><span type>const</span> response = <span keyword>await</span> <span function>fetch</span><span brackets>(</span>url, <span brackets>{</span> <span function>method:</span> <span string>"DELETE"</span> <span brackets>}</span><span brackets>)</span>;</code>`,
                descrizione: "Esempio Chiamata DELETE",
                codice: `
import Service from "${BASE_URL}/LAMP/ServerModule/LampService.js";
import { obiAlert } from "${BASE_URL}/core.js";

const url = "http://myserver/applicationName/controller";

async function deleteData(){
    return await Service.instance.delete(url).catch(ex => obiAlert(ex, { type: "error" }));
}
                `,
            },
            {
                titolo: "UPLOAD, UPDATE, INSERT",
                note: `Queste funzioni sono personalizzazioni delle funzioni precedenti pensate per essere integrate nei form e nel caricamento di file.
                <ul>
                    <li><strong>UPLOAD</strong>: Consente di inviare dati al server, permette di specificare se usare il metodo POST (default) o PUT e riconosce automaticamente il tipo di dato tra JSON e FormData</li>
                    <li><strong>UPDATE</strong>: Utilizza il metodo POST per inviare dati al server. La tipologia dei dati è indicata come FormData</li>
                    <li><strong>INSERT</strong>: Utilizza il metodo PUT per inviare dati al server. La tipologia dei dati è indicata come FormData</li>
                </ul>
                `,
                descrizione: "Esempio Caricamento Dati con UPLOAD",
                codice: `
<form id='my_form' onsubmit='saveFile'>
    <input name='Nome' type='text'/>
    <input name='Documento' type='file' />
    <button type='submit'>Salva</button>
</form>
<script type='module'>
    import Service from "${BASE_URL}/LAMP/ServerModule/LampService.js";
    
    const url = "http://myserver/applicationName/controller";

    function saveFile(evt){
        evt.preventDefault();
        var form = document.getElementById("my_form");
        var data = new FormData(form);
        Service.instance.upload(url, data, "PUT");
    }
</script>
                `,
            },
            {
                titolo: "CONTROLLER",
                note: `Tutte le chiamate standard al server di ServerModule supportano il controllo della connession tramite un AbortController che permette di terminare la connessione a comando.
                
                Di default tutte le connessioni sono temporizzate su 30 secondi oltre i quali la connessione viene interrotta`,
                descrizione: "Personalizzare il Controller di Connessione",
                codice: `
import Service from "${BASE_URL}/LAMP/ServerModule/LampService.js";

//Creo il controller di connessione
const controller = new AbortController();
//Definisco il metodo per interrompere la connessione
function abortConnection(){
    controller.abort("Connessione Interrotta Manualmente");
}
//Inizializzo un nuovo servizio con il mio controller ed un timer di connessione personalizzato a 60 secondi.
const server = Service.Instance({ controller: controller, connectionTimer: 60000 });
                `,
            },
            {
                titolo: "LOAD",
                note: `La funzione Load permette di caricare una porzione di pagina direttamente dal server.
                All'interno della funzione viene richiamato un indirizzo url con metodo <strong>GET</strong> che <mark>sostituisce con il contenuto del Response elaborato come testo HTML</mark> l'interno del nodo.`,
                descrizione: "Esempio utilizzo funzione LOAD",
                codice: `
<section id='container'></section>
<script type='module'>
    import Service from "${BASE_URL}/LAMP/ServerModule/LampService.js";

    const url = "http://myserver/applicationName/controller";
    var element = document.getElementById("container");
    Service.instance.load(element, url);
</script>
                `,
            },
            {
                titolo: "RUN SCRIPT",
                note: `La funzione runScript consente di mandare una richiesta al server di <mark>eseguire codice Javascript</mark>.
                
                La funzione crea nel documento HTML un nuovo elemento script e ne allega l'attributo src con l'url indicato. Al trigger dell'evento load viene eseguita la connessione al server, il codice viene scaricato ed eseguito.`,
                descrizione: "",
                codice: `
import Service from "${BASE_URL}/LAMP/ServerModule/LampService.js";

const url = "http://myserver/applicationName/controller";
Service.instance.runScript(url);
                `,
            },
        ]
    }