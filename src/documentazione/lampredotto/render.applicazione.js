export default {
    id: "docs.lampredotto.render.applicazione",
    nome: "RenderModule - Applicazione",
    sezioni: [
        {
            titolo: "Introduzione",
            descrizione: "Inizializzare una nuova applicazione",
            note: `All'interno del framework Lampredotto JS per applicazione si intende sostanzialmente un <strong>contenitore di dati e funzioni</strong> che interagiscono tra di loro all'interno di uno scope chiuso e limitato all'applicazione stessa.
            
            Questa classe è legata all'interfaccia tramite l'attributo <mark>id</mark> di uno degli elementi HTML nella pagina.
            Una volta registrato l'elemento HTML tutto il suo contenuto entra a far parte dello scope dell'applicazione tramite un processo di <strong>virtualizzazione</strong> dei nodi HTML, questo consente di interagire col documento dal javascript sfruttando i dati conservati all'interno dell'applicazione. 
            `,
            codice: `
//file main.html
<bo`+ `dy>

    <div id='app'></div>

    <scr`+ `ipt type='module'>
        import RenderEngine from \"${BASE_URL}/LAMP/RenderModule/LampRender.js\";
      
        var app = RenderEngine.instance.start("app").build({
            dataset: {}, //set di dati dell'applicazione
            storage: {}, //set di dati indipendenti dall'aggiornamento dinamico dell'interfaccia
            computed: {}, //set di dati in sola lettura dell'applicazione
            actions: {}, //funzioni dell'applicazione
            events: [], //eventi dell'applicazione
            settings: {} //impostazioni dell'applicazione
        });
    </scr`+ `ipt>
</bo`+ `dy>
    `,
        },
        {
            titolo: "La Virtualizzazione del DOM",
            note: `Nel processi di inizializzazione del'Applicazione uno dei passaggi principali consiste nella <mark>virtualizzazione</mark> della porzione di DOM indicata dall'id.
            
            Questo processo consiste nel creare una copia parallela dei <strong>nodi HTML</strong> contenuti nell'elemento di riferimento replicandone anche la struttura ad albero.
            La copia virtualizzata è composta da oggetti definiti <mark>Nodi Virtuali</mark> o <code>vNode</code> che contengono diverse funzioni di <strong>elaborazione</strong> e <strong>rendering</strong> del nodo originale nonché un riferimento allo stesso.
            A sua volta al <strong>nodo HTML</strong> stampato a schermo viene iniettato il nodo virtuale nelle proprietà all'interno della keyword <code>virtual</code>
            `,
            codice: `<nodo-html /> → vNode(elemento: HTMLNode) → elaborazione e rendering dei dati dell'applicazione → <nodo-html-modificato />

 //recuperare il nodo virtuale dall'elemento HTML
<div id='elemento_virtuale'></div>
<script>
    var vnode = document.getElementByID("elemento_virtuale").virtual;
</script>
            
            `,
            descrizione: "Schema della Virtualizzazione",
        },
        {
            titolo: "Parametri dell'Applicazione",
            note: `I parametri dell'applicazione definiscono il contesto dei dati nel quale l'applicazione opera.
Nello specifico questi si suddividono in:
<ul>
    <li><strong>DATASET</strong>: raccolta delle proprietà dello scope dell'applicazione.</li>
    <li><strong>STORAGE</strong>: Contenitore delle proprietà non legate all'interfaccia.</li>
    <li><strong>COMPUTED</strong>: raccolta di funzioni che restituiscono un valore, rappresentano i dati in sola lettura.</li>
    <li><strong>ACTIONS</strong>: raccolta di funzioni che elaborano i dati e rispondono ad eventi.</li>
    <li><strong>EVENTS</strong>: lista di oggetti che rappresentano i trigger degli eventi dell'applicazione.</li>
    <li><strong>SETTINGS</strong>: insieme delle impostazioni che racchiudono le impostazioni di interfaccia, di debug e di formato stampa dei dati.</li>
</ul>
Durante il processo di definizione dello <code>scope</code>, il <strong>RenderEngine</strong> unisce in un unico contesto gli elementi <mark>DATASET</mark>, <mark>COMPUTED</mark> ed <mark>ACTIONS</mark>.
Ogni proprietà del contesto viene associata ad un <code>Proxy</code> o trasformata in un <code>getter - setter</code> che collega dinamicamente i dati al rendering sull'interfaccia.
Il contesto dati dell'applicazione è utilizzato come scope all'interno di ogni funzione, quindi si può fare riferimento al set di dati con la keyword <mark>this</mark>.
                        `,
            descrizione: "Esempio di Applicazione con Parametri",
            codice: `
RenderEngine.instance.start("app").build({
    dataset: {
        pippo: "",
        pluto: 100,
        timestamp: new Date(),
        lista: ["a", "b", "c"],
    },
    computed: {
        lista_filtrata: function(){
            return this.lista.filter(item => item != "b");
        }
    },
    actions: {
        stampa: function(evt){
            var target = evt.currentTarget;
            alert(target.getAttribute("id"));
        }
    },
    events: [
        {
            name: "progress",
            action: function(state){
                if(state == "mounted") this.pippo = "pippo";
            }
        }
    ],
    settings: {
        debug: true,
        debug_mode: "app",
        formatters: [
            { type: "number", stamp: (value) => { return value + "€" } },
        ],
        interface: {
            darkmode: false,
            radius: "4px",
            animation: "fast",
            palette: [
                { name: "brand", color: "#FF7E21" },
                { name: "primary", color: "#69461E" },
                { name: "secondary", color: "#61574C" },
                { name: "tertiary", color: "#1A406B" },
            ],
            font: "'Roboto', sans-serif",
        }
    }
});
                            `,
        },
        {
            titolo: "Il Ciclo Vita",
            note: `Il ciclo vita dell'applicazione si suddivide nei seguenti passaggi:
<ul>
    <li><strong>CREATE</strong>: Viene creata una nuova istanza dell'applicazione con riferimento ad un elemento HTML della pagina.</li>
    <li><strong>SETUP</strong>: Viene virtualizzato il contenuto del riferimento HTML.</li>
    <li><strong>BUILD</strong>: Vengono definiti il contesto dati, gli eventi e le impostazioni.</li>
    <li><strong>ELABORATE</strong>: Il contenuto dell'applicazione viene renderizzato per la prima volta.</li>
    <li><strong>UPDATE</strong>: Il rendering dell'applicazione viene aggiornato.</li>
    <li><strong>DISPOSE</strong>: L'applicazione e tutto il suo contenuto vengono eliminati.</li>
</ul>
                            `,
            descrizione: "Schema del ciclo vita dell'Applicazione",
            codice: `.              
      CREATE
        ↓
      SETUP
        ↓
      BUILD
        ↓
    ELABORATE
        ↓
 READY FOR UPDATE -----→ DISPOSE
       ↓  ↑
      UPDATE
`,
        },
        {
            titolo: "Gli Eventi dell'Applicazione",
            note: `
Tramite la definizione di eventi tra le proprietà dell'applicazione è possibile andare ad eseguire delle azioni durante specifici momenti del ciclo vita dell'applicazione.
A seguire la lista degli eventi supportati:
<ul>
    <li><strong>Progress</strong>: Viene eseguito ogni volta che cambia lo stato durante il ciclo vita, trasmette lo stato attuale come parametro
        <ul>
            <li><code>creating</code>: inizializzazione dell'applicazione</li>
            <li><code>setup</code>: DOM virtualizzato</li>
            <li><code>created</code>: inizializzazione completata</li>
            <li><code>mounting</code>: inizio creazione dello scope</li>
            <li><code>mounted</code>: scope creato e prima stampa a schermo</li>
            <li><code>updating</code>: aggiornamento dei dati e dell'interfaccia</li>
            <li><code>updated</code>: aggiornamento dell'interfaccia completato</li>
            <li><code>unmounting</code>: inizio processo di cancellazione</li>
            <li><code>unmounted</code>: contenuto applicazione cancellato</li>
            <li><code>error</code>: errore nel processo</li>
        </ul>
    </li>
    <li><strong>Update</strong>: Viene eseguito alla modifica dei dati, trasmette l'applicazione come parametro</li>
    <li><strong>Render</strong>: Viene eseguito alla fine dei ogni rendering, trasmette l'applicazione come parametro</li>
</ul>
Un utile esempio è quello di sfruttare l'update per eseguire dei debug oppure l'evento progress per caricare dati dal server senza interrompere l'interfaccia.
    `,
            descrizione: "Esempio di utilizzo eventi dell'Applicazione",
            codice: `
import Collection from \"${BASE_URL}/LAMP/RenderModule/modules/enumerators.js\";

var sample = {
    name: Collection.application_event.progress,
    action: async function(stato){
        switch(stato){
            //sfrutto l'evento progress per agire nel ciclo vita prima della fase di stampa e scaricare i dati dal server
            case Collection.lifecycle.mounted:
                this.list = await getDatiDalServer();
                break;
        }
    }
}
` }
    ]
}