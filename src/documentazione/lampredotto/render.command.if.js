export default
    {
        id: "docs.lampredotto.render.comandi.if",
        nome: "RenderModule - Comando If",
        sezioni: [
            {
                titolo: "CMD-IF | CMD-ELSEIF | CMD-ELSE",
                descrizione: `Esempio di utilizzo cmd-if`,
                note: `Il <strong>comando IF</strong> stampa un <mark>elemento HTML</mark> o meno in base ad una condizione booleana.

È possibile impostare un blocco di condizioni combinando il <strong>cmd-if</strong> con gli altri comandi <strong>cmd-elseif</strong> e <strong>cmd-else</strong> purchè gli elementi HTML su cui sono applicati siano tutti figli dello stesso <mark>elemento HTML</mark>.`,
                codice: `<div id='cmdif'>
    <group-component margin='sm'>
        <button @click="$.view = 'primo'">tasto 1</button>
        <button @click="$.view = 'secondo'">tasto 2</button>
        <button @click="$.view = 'terzo'">tasto 3</button>
    </group-component>

    <obi-chip relevance='primary' cmd-if="$.view == 'primo'">Primo Elemento</obi-chip>
    <obi-chip relevance='secondary' cmd-elseif="$.view == 'secondo'">Secondo Elemento</obi-chip>
    <obi-chip relevance='tertiary' cmd-else>Terzo Elemento</obi-chip>
</div>

<script type='module'>        
    import RenderEngine from "${BASE_URL}/LAMP/RenderModule/LampRender.js";

    RenderEngine.instance.start("cmdif").build({
        dataset: {
            view: "primo",
        },
    });
</scr`+ `ipt>`,
                preview: true,
            },
        ],
    }