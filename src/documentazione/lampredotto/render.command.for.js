export default
    {
        id: "docs.lampredotto.render.comandi.for",
        nome: "RenderModule - Comando For",
        sezioni: [
            {
                titolo: "CMD-FOR + CMD-FILTER + CMD-SORT | CMD-SORT:DESC",
                descrizione: `Esempio di utilizzo cmd-for`,
                note: `Il <strong>comando FOR</strong> serve ad <mark>iterare</mark> un <strong>elemento HTML</strong> legandolo ad un array del contesto dati.

E' possibile combinare il <strong>cmd-for</strong> con altri comandi come <strong>cmd-filter</strong> per <mark>applicare un filtro</mark> sulle iterazioni e <strong>cmd-sort</strong> per <mark>ordinare</mark> l'array.
Per <mark>ordinare in ordine decrescente</mark> alla dicitura del comando <strong>SORT</strong> si aggiunge <code>:desc</code>
<blockquote>
<strong text-color='info'>NOTA</strong>
<ul>
    <li>All'interno dei <strong>cmd-filter</strong> e <strong>cmd-sort</strong> il riferimento all'iterazione non ha bisogno del <span tag>$</span> per essere letto.</li>
    <li>Per fare riferimento all'indice dell'iterazione usare la keyword <span keyword>:index</span>.</li>
</ul>

</blockquote>
`,
                codice: `<div id='cmdfor' display-row>
    <div padding='sm'><obi-chip cmd-for="item in lista">{{:index + " - " + $.item}}</obi-chip></div>
    <div padding='sm'><obi-chip cmd-for="item in lista" cmd-filter='item.includes("e")'>{{item}}</obi-chip></div>
    <div padding='sm'><obi-chip cmd-for="item in lista" cmd-sort='item'>{{item}}</obi-chip></div>
<div>

<script type='module'>        
    import RenderEngine from "${BASE_URL}/LAMP/RenderModule/LampRender.js";

    RenderEngine.instance.start("cmdfor").build({
        dataset: {
            lista: ["Marco", "Katia", "Andrea", "Walter", "Sabrina", "Bruno", "Maurizio"],
        },
    });
</scr`+ `ipt>`,
                preview: true,
            },
        ],
    }