export default {
    id: "docs.components.servizi",
    nome: "iService",
    sezioni: [
        {
            titolo: "Interfaccia di servizio",
            note: `<strong>iService</strong> è un'interfaccia con lo scopo di impostare un AbortController personalizzato per ogni file di servizio connessione al server`,
            descrizione: "Definizione della classe iService",
            codice: `
class iService {
    //controller di connessione
    controller;
    //Restituisce se la connessione è stata interrotta
    get aborted()
    //Restituisce il segnale di connessione
    get signal()
    //inizializza il controller
    resetController()
    //Interromper la connessione
    abort(reason)
}
            `,
        },
        {
            descrizione: "File esempio 'dati.services.js'",
            codice: `
import Service from "${BASE_URL}/LAMP/ServerModule/LampService.js";
import { iService } from "${BASE_URL}/core.js";

class DatiService extends iService {

    const url = "http://indirizzourl";

    constructor(){ super(); }

    async readDati(){
        return await Service.Instance({ controller: this.controller }).getJson(this.url);
    }
}
`,
        },
        {
            descrizione: "File Esempio 'Index.html'",
            codice: `
<div id='sampleApp'>
    <obi-table :dati="lista"></obi-table>
</div>


<script type='module'>
    import RenderEngine from "${BASE_URL}/LAMP/RenderModule/LampRender.js";
    import DatiService from "./dati.services.js";

    RenderEngine.instance.start("sampleApp").build({
        dataset: {
            lista: [],
            service: new DatiService(),
        },
        actions: {
            async loadData(){
                this.lista = await this.service.readDati();
            },
            abort(){
                this.service.abort();
            },
        }
    });

</script>
            `,
        },
    ]
}