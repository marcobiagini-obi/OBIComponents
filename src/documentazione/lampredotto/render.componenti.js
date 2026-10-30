export default {
    id: "docs.lampredotto.render.componenti",
    nome: "RenderModule - Componenti",
    sezioni: [
        {
            titolo: "Introduzione",
            descrizione: `Inizializzare un componente`,
            note: `
I <strong>Componenti</strong> sono contenitori indipendenti ed autonomi utilizzabili all'interno dell'<strong>applicazione</strong> con lo scopo di rendere il codice del progetto <mark>riutilizzabile</mark>, <mark>manutenibile</mark> ed <mark>indipendente</mark>.

Attraverso la definizione dei <code>template</code>, di un <code>selettore HTML personalizzato</code> e delle <code>proprietà</code> in tutto simili a quelle dell'<strong>applicazione</strong> il <strong>componente</strong> permette di <mark>partizionare</mark> le logiche del software rendendolo organizzato ed evitando la duplicazione di codice.
Inoltre ogni componente è considerabile come una piccola applicazione all'interno dell'<strong>applicazione</strong> principale la quale ha la funzione di collante e consente di <mark>condividere dati</mark> tra i vari componenti.

Ad esempio ogni elemento della collezione di <strong>OBIComponents</strong> è un componente LAMP`,
            codice: `
import { defineComponent } from \"${BASE_URL}/LAMP/RenderModule/LampRender.js\";

defineComponent({
    selector: "", //Tag HTML personalizzato per richiamare il componente
    template: "", //Template HTML del componente
    options: {
        inputs: [], //lista di stringhe, indica i nomi degli attributi che permettono di sincronizzare dati con un contesto esterno
        dataset: {}, //set di dati del componente
        storage: {}, //set di dati indipendenti dall'aggiornamento dinamico dell'interfaccia
        computed: {}, //set di dati in sola lettura del componente
        actions: {}, //funzioni del componente
        events: [], //eventi del componente
        settings: {} //impostazioni del componente
    }
});
    `,
        },
        {
            titolo: "Parametri del Componente",
            note: `I parametri del componente definiscono il contesto dei dati nel quale questo opera.
Nello specifico questi si suddividono in:
<ul>
    <li><strong>INPUTS</strong>: lista delle proprietà valorizzabili dall'esterno del componente.</li>
    <li><strong>DATASET</strong>: raccolta delle proprietà interne del componente.</li>
    <li><strong>COMPUTED</strong>: raccolta di funzioni che restituiscono un valore, rappresentano i dati in sola lettura.</li>
    <li><strong>ACTIONS</strong>: raccolta di funzioni che elaborano i dati e rispondono ad eventi.</li>
    <li><strong>EVENTS</strong>: lista di oggetti che rappresentano i trigger degli eventi del componente.</li>
    <li><strong>SETTINGS</strong>: insieme delle impostazioni che racchiudono le informazioni di formato stampa dei dati.</li>
</ul>
Durante il processo di definizione dello <code>scope</code>, il <strong>RenderEngine</strong> unisce in un unico contesto gli elementi <mark>INPUTS</mark>, <mark>DATASET</mark>, <mark>COMPUTED</mark> ed <mark>ACTIONS</mark>.
Ogni proprietà del contesto viene associata ad un <code>Proxy</code> o trasformata in un <code>getter - setter</code> che collega dinamicamente i dati al rendering sull'interfaccia.
Il contesto dati dell'applicazione è utilizzato come scope all'interno di ogni funzione, quindi si può fare riferimento al set di dati con la keyword <mark>this</mark>.
                        `,
            descrizione: "Esempio di Componente con Parametri",
            codice: `
defineComponent({
    selector: "my-component",
    template: \`<div>{{stampa_titolo}}</div><button @click='stampa'></button>\`,
    options: {
        inputs: ["titolo"],
        dataset: {
            titolo: "",
        },
        computed: {
            stampa_titolo: function(){
                return this.titolo.toUpperCase();
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
                    if(state == "mounted" && this.titolo == "") this.titolo = "Titolo di Default";
                }
            }
        ],
        settings: {
            formatters: [
                { type: "number", stamp: (value) => { return value + "€" } },
            ],
        }
    }
});                            `,
        },
        {
            titolo: "Il Ciclo Vita",
            note: `Come per l'Applicazione anche i componenti hanno il loro ciclo vita.
<ul>
    <li><strong>INITIALIZE</strong>: Crea il componente recuperandolo dal deposito in sessione dei vari componenti, imposta il template e registra le varie opzioni</li>
    <li><strong>SETUP</strong>: Analizza i comandi presenti nel tag HTML e registra i dati per il processo di renderizzazione</li>
    <li><strong>BUILD CONTEXT</strong>: Costruisce i contesto dei dati mettendo insieme quelli delle opzioni legati al rendering del Componente in se' e gli input che vengono legati al rendering del parent da cui vengono ereditati</li>
    <li><strong>ELABORATE</strong>: Esegue il primo effettivo rendering del Componente</li>
    <li><strong>READY</strong>: Indica che il componente è pronto per le potenziali modifiche</li>
    <li><strong>UPDATE</strong>: Alla modifica dei dati viene aggiornato il rendering del componente, una volta completato il processo lo stato torna su READY</li>
    <li><strong>DISPOSE</strong>: Elimina il componente sia a livello virtuale che di nodo HTML</li>
</ul>`,
            descrizione: `Schema del ciclo vita del Componente`,
            codice: `.
    INITIALIZE
        ↓
      SETUP
        ↓
BUILD COMPONENT CONTEXT
        ↓
    ELABORATE
        ↓
 READY FOR UPDATE -----→ DISPOSE
       ↓  ↑
      UPDATE
 .   `
        },
        {
            titolo: "Eventi del Componente",
            note: `Gli eventi del componente sono eseguiti al verificarsi dei vari cambi di stato sul ciclo vita dello stesso.
<ul>
<li><strong>Progress</strong>: Viene eseguito ogni volta che cambia lo stato durante il ciclo vita, trasmette lo stato attuale come parametro
        <ul>
            <li><code>creating</code>: inizializzazione del componente</li>
            <li><code>setup</code>: DOM virtualizzato</li>
            <li><code>created</code>: inizializzazione completata</li>
            <li><code>mounting</code>: inizio creazione del primo rendering</li>
            <li><code>context_creating</code>: inizio creazione dello scope</li>
            <li><code>context_created</code>: creazione dello scope completata</li>
            <li><code>mounted</code>: conclusa prima stampa a schermo</li>
            <li><code>updating</code>: aggiornamento dei dati e dell'interfaccia</li>
            <li><code>updated</code>: aggiornamento dell'interfaccia completato</li>
            <li><code>unmounting</code>: inizio processo di cancellazione</li>
            <li><code>unmounted</code>: contenuto applicazione cancellato</li>
            <li><code>error</code>: errore nel processo</li>
        </ul>
    </li>
<li><strong>Setup</strong>: Viene eseguito all'inizio del setup</li>
<li><strong>Render</strong>: Viene eseguito alla fine del rendering</li>
<li><strong>Inject</strong>: Viene eseguito quando si aggiunge del codice HTML all'interno del nodo</li>
<li><strong>Virtualized</strong>: Viene eseguito alla fine della virtualizzazione del nodo</li>
<li><strong>Dataset</strong>: Viene eseguito al completamento della definizione dello scope</li>`,
            descrizione: null,
            codice: null,
        },
        {
            titolo: "Immettere Dati nel Componente",
            note: `
            Come detto nell'introduzione i componenti sono delle porzioni di applicazione che vivono di una loro autonomia nelle logiche e nello scope.
            Può capitare però che ci sia necessità di trasmettere dei dati dall'<strong>applicazione</strong> al <strong>componente</strong>.

            Per legare un <mark>valore dello scope</mark> dell'applicazione ad una <mark>variabile interna</mark> del componente innanzitutto è necessario specificare il nome della variabile del componente preposta a ricevere il dato tra gli <code>INPUTS</code>.
            
            Una volta definiti gli <code>INPUTS</code> queste proprietà diventano automaticamente degli attributi del <strong>tag HTML</strong> del componente.
            Sfruttando il <strong>CMD-BIND</strong> a questo punto possiamo legare una proprietà dell'applicazione al componente valorizzando il suddetto attributo.

            Ovviamente non è necessario specificare ogni singolo input sugli attributi del tag, le proprietà non valorizzate risulteranno null all'interno della logica componente.
            Per eventualmente assegnare un valore di <strong>default</strong> a queste proprietà queste vanno definite all'interno del dataset col relativo valore.

            Una volta legate due proprietà tra applicazione e componente queste restano sincronizzate.
            `,
            descrizione: "Esempio",
            codice: `<body>
<scr`+ `ipt type='module'>
    import RenderEngine from "${BASE_URL}/LAMP/RenderModule/LampRender.js";
    import { defineComponent } from "${BASE_URL}/LAMP/RenderModule/LampRender.js";

    //Definisco il componente
    defineComponent({
        selector: "my-component",
        template: "<input type='text' :value='testo'/>",
        options: {
            inputs:["testo"], //Imposto tra gli Inputs la proprietà "testo"
            dataset: {
                testo: "prova inputs", //Assegno alla proprietà "testo" un valore di default
            },
        },
    });

    //Inizializzo l'applicazione
    RenderEngine.instance.start("app").build({
        dataset: {
            stamp: "Hello World", //Imposto la proprietà "stamp"
        }
    });
    </scr`+ `ipt>
    <div id='app'>
        //Assegno alla proprietà 'testo' del componente il valore di 'stamp' dell'applicazione
        <my-component :testo='stamp'></my-component>
    </div>
</bo`+ `dy>`,
        },
        {
            titolo: "Trasmettere Dati dal Componente",
            note: `All'interno dei processi di realizzazione di un'applicazione si renderà necessario anche poter <mark>interagire con i processi e i dati interni del componente</mark>.
Per poter estrapolare i dati dal componente è necessario implementare una logica di svilupo basata sugli <strong>eventi</strong>. Il comando <strong>CMD-ON</strong> infatti supporta non solo gli eventi standard HTML ma anche eventuali eventi personalizzati.

All'interno delle funzioni del componente è quindi possibile richiamare l'esecuzione di un <strong>evento personalizzato</strong> col codice

<code rounded padding='sm' style='background-color: #121212; color: #9f9f9f'><span keyword>this</span>.__node.trigger(<span string>"nome_evento_personalizzato"</span>, ...lista_parametri);</code>

Questo consente di catturare il suddetto evento direttamente dal tag del componente quando viene applicato tramite il <strong>CMD-ON</strong>.
I <strong>parametri</strong> passati nel <strong>trigger</strong> risulteranno come <mark>attributi della funzione</mark> eseguita alla cattura dell'evento`,
            descrizione: "Esempio",
            codice: `<body>
    <scr`+ `ipt type='module'>
        import RenderEngine from "${BASE_URL}/LAMP/RenderModule/LampRender.js";
        import { defineComponent } from "${BASE_URL}/LAMP/RenderModule/LampRender.js";

        defineComponent({
            selector: "my-component",
            template: "<input type='text' :value='testo' @change='onInputChange'/>", //lego all'evento di modifica dell'input una funzione che contiene il trigger ad un evento personalizzato
            options: {
                dataset: {
                    testo: "prova evento personale",
                },
                actions: {
                    onInputChange: function(evt){
                        this.__node.trigger("inputchange", this.testo); //eseguo il trigger dell'evento personalizzato al quale passo il testo del componente
                    }
                }
            },
        });

        RenderEngine.instance.start("app").build({
            actions: {
                stamp: function(testo){
                    alert(testo); //stampo il testo che mi è arrivato dal componente
                }
            }
        });
    </scr`+ `ipt>

    <div id='app'>
        //col comando @inputchange metto all'ascolto il componente sull'omonimo evento che al trigger eseguirà la funzione "stamp"
        <my-component @inputchange='stamp'></my-component>
    </div>

</bo`+ `dy>`,
        }
    ]
}