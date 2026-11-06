import { BASE_URL } from "../../../obi.config.js";

export default
    {
        id: "docs.lampredotto",
        nome: "Lampredotto JS",
        sezioni: [
            {
                titolo: "Introduzione",
                note: `<strong>Lampredotto JS</strong> è un Framework sviluppato in JavaScript open source progettato per rendere intuitivo e rapido lo sviluppo di applicativi front end.
                                    Il Framework prende ispirazione dalla semantica di <mark>Vue JS</mark>, dalla gestione dei componenti in <mark>React</mark> e dai pattern di <mark>AngularJS</mark>.
                                    Una delle caratteristiche di <strong>Lampredotto JS(LAMP)</strong> è quella di essere <i>flessibile</i> e consente di integrare liberamente codice proprietario alle logiche del framework.
                                    
                                    Le risorse alla documentazione ufficiale di <strong>Lampredotto JS</strong> sono disponibili a questo indirizzo web: <a link href="https://github.com/Ongaku96/Lampredotto-JS" target="_blank">sito GitHub</a>
                                    <blockquote cite="https://github.com/Ongaku96/Lampredotto-JS"><code>In questo sito è presente una documentazione in italiano contente i concetti di base per usare al meglio questo strumento.</code></blockquote>`,
                descrizione: null,
                codice: null,
            },
            {
                titolo: "I Moduli",
                note: `<strong>Lampredotto JS</strong> è costruito secondo una logica a blocchi, a seconda della funzione specifica viene fornito un modulo indipendente degli altri che però seguono la stessa logica di progettazione.
                                    I principali moduli disponibili attualmente sono:
                                    <ul>
                                        <li><strong>RENDER MODULE</strong>: Si occupa di tutto ciò che riguarda la gestione del rendering dell'interfaccia</li>
                                        <li><strong>SERVER MODULE</strong>: Modulo dedicato allo scambio di dati col server</li>
                                        <li><strong>USER MODULE</strong>: Modulo di utilità per gestire l'utente in sessione lato front end</li>
                                    </ul>
<group-component>
    <obi-button label='RENDER MODULE' @click='$.navigate("docs.lampredotto.render")' variant='filled'></obi-button>
    <obi-button label='SERVER MODULE' @click='$.navigate("docs.lampredotto.server")' variant='filled'></obi-button>
    <obi-button label='USER MODULE' @click='$.navigate("docs.lampredotto.user")' variant='filled'></obi-button>
</group-component>`,
                descrizione: null,
                codice: null,
            },
            {
                titolo: "Principi di design",
                note: `Come precedentemente specificato i diversi moduli seguono gli stessi principi di design.
                                    Questi principi sono principalmente due, l'utilizzo dei <mark>moduli Javascript</mark> e l'accesso ai servizi tramite <mark>pattern singleton</mark>`,
                descrizione: "Esempio di utilizzo dei moduli LAMP",
                codice: `<script type='module'>
    //Importazione dei moduli
    import RenderEngine from "${BASE_URL}/LAMP/RenderModule/LampRender.js";
    import Service from "${BASE_URL}/LAMP/ServerModule/LampService.js";
    import UserHandler from "${BASE_URL}/LAMP/UserModule/LampAccess.js";
                                        
    //Nuova Istanza di RenderModule
    var render = RenderEngine.instance;

    //Nuova Istanza di ServerModule
    var server = Service.instance;
                                        
    //Nuova Istanza di UserModule
    var user = UserHandler.instance;
</scr`+ `ipt>`,
            },
        ]
    }