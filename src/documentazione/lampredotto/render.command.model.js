import { BASE_URL } from "../../../obi.config.js";

export default {
    id: "docs.lampredotto.render.comandi.model",
    nome: "RenderModule - Comando Model",
    sezioni: [
        {
            titolo: "CMD-MODEL",
            note: `Il comando <strong>MODEL</strong> permette la stampa di una <mark>proprietà</mark> o del risultato di una esecuzione <mark>inline script</mark> legati al contesto dati in un elemento HTML.
Nel caso di applicazione del <strong>model</strong> su un <mark>elemento di input</mark> viene legato dinamicamente il valore della proprietà a quella dell'elemento.
Questo significa che al variare della proprietà verrò aggiornato in tempo reale l'input e al variare dell'input verrà aggiornata in tempo reale la proprietà.

Un'alternativa alla proprietà <strong>cmd-model</strong> è quella di usare le doppie graffe <code>"<span keyword>{</span><span keyword>{</span>  <span keyword>}</span><span keyword>}</span>"</code>all'esterno dei tag HTML.
In questo modo verrà eseguito il contenuto delle parentesi come se fosse uno script.
<blockquote>
<span font-type='h6' text-color='info'>NOTA BENE</span>
Il valore restituito in questo caso non supporta i tag html che verrebbero stampati come testo.
</blockquote>
Per fare riferimento allo <code>scope</code> dell'applicazione negli script è possibile usare la keyword <code><span type>this</span></code> o la shortcut <code><span type>$</span></code>.`,
            codice: `
<div id='cmdmodel'>
    {{stampa}}<br>
    <input cmd-model='prova'/><br>
    <label cmd-model='prova'></label>
<div>

<script type='module'>        
    import RenderEngine from "${BASE_URL}/LAMP/RenderModule/LampRender.js";

        RenderEngine.instance.start("cmdmodel").build({
            dataset: {
                prova: "OBI Italia",
            },
            computed: {
                stampa: function(){
                    return this.prova.replaceAll("OBI", "<strong style='color: orange;'>OBI</strong>")
                }
            }
        });
</scr`+ `ipt>
                                `,
            descrizione: `Esempio di utilizzo cmd-model`,
            preview: true,
        },
    ]
}