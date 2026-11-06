import { BASE_URL } from "../../../obi.config.js";

export default
    {
        id: "docs.lampredotto.render.comandi.bind",
        nome: "RenderModule - Comando Bind",
        sezioni: [
            {
                titolo: "CMD-BIND:attribute || :attribute",
                descrizione: `Esempio di utilizzo cmd-bind`,
                note: `Il comando <strong>BIND</strong> rende dinamico un attributo dell'elemento HTML. 
                Al variare della proprietà dell'applicazione cambierà il valore dell'attributo, se il valore della proprietà è nullo l'attributo verrà rimosso.

E' possibile usare una shortcut usando <code>:nome_attributo</code> al posto di <code>cmd-bind:attributo</code>

<mark> attributo=" " → cmd-bind:attributo=" " / :attributo=" "</mark>`,
                codice: `<div id='cmdbind'>
    <label>Modifica il title</label><br>
    <input cmd-model='prova' type="text" />
    <hr />
    <obi-chip relevance='tertiary' margin='md' :title="prova">Tieni il mouse qua sopra per far apparire il title</obi-chip>
<div>

<script type='module'>        
    import RenderEngine from "${BASE_URL}/LAMP/RenderModule/LampRender.js";

    RenderEngine.instance.start("cmdbind").build({
        dataset: {
            prova: "OBI Italia",
        },
    });
</scr`+ `ipt>`,
                preview: true,
            },
        ]
    }