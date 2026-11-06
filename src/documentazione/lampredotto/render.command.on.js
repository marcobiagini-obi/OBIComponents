import { BASE_URL } from "../../../obi.config.js";

export default
    {
        id: "docs.lampredotto.render.comandi.on",
        nome: "RenderModule - Comando On",
        sezioni: [
            {
                titolo: "CMD-ON:event || @event",
                descrizione: `Esempio di utilizzo cmd-on`,
                note: `Il comando <strong>ON</strong> permette di registrare un <mark>evento</mark> su un elemento HTML legato a funzioni del contesto dati.

E' possibile usare una shortcut usando <code text-color='info'>@evento</code> al posto di <code text-color='info'>cmd-on:evento</code>.
Gli eventi pre esistenti in <strong>HTML5</strong> come <code>onclick</code> o <code>onchange</code> per essere richiamati va rimossa la dicitura 'on'

<mark>onclick=" " → cmd-on:click=" " / @click=" "</mark>

<blockquote>
<span font-type='h6' text-color='info'>NOTA BENE</span>
Questo comando distingue gli eventi stock di HTML da quelli personalizzati:
<ul>
    <li>In caso di <strong>evento HTML</strong> viene legato un evento direttamente all'elemento HTML ed all'azione dell'evento viene passato come parametro l'evento in se'</li>
    <li>In caso di <strong>evento personalizzato</strong> questo viene registrato nell'handler interno del nodo virtuale e al momento dell'azione vengono passati in lista tutti i parametri del trigger</li>
</ul>
</blockquote>
                                `,
                codice: `
<div id='cmdon'>
    <input cmd-model='prova' type="text" />
    <button @click="stampa">Stampa</button>
<div>

<script type='module'>        
    import RenderEngine from "${BASE_URL}/LAMP/RenderModule/LampRender.js";

    RenderEngine.instance.start("cmdon").build({
        dataset: {
            prova: "OBI Italia",
        },
        actions:{
            stampa: function(){
                alert(this.prova);
            }
        }
    });
</scr`+ `ipt>`,
                preview: true,
            },
        ]
    }