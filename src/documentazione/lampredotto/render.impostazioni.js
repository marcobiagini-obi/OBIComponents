
export default {
    id: "docs.lampredotto.render.impostazioni",
    nome: "RenderModule - Impostazioni",
    sezioni: [
        {
            titolo: "Introduzione",
            note: `
Le impostazioni permettono di gestire il debug, l'interfaccia e la formattazione dei dati.
Per quello che riguarda il debug e la formattazione locale le impostazioni sono applicate a livello globale se associate all'applicazione mentre localmente se applicate al singolo componente.
<ul>
<li><strong>DEBUG</strong>: Abilita la stampa dei log di rendering e degli alert in console, ci sono tre modalità: tutto, solo comandi, solo app specificandone l'id.  *vedere utility per l'enumeratore</li>
<li><strong>FORMATTERS</strong>: Lista di oggetti di tipo { type: string, stamp: (value: any)=>any }, servono a personalizzare la stampa dei dati a schermo.</li>
<li><strong>INTERFACE</strong>: Impostazioni dell'interfaccia dell'applicazione.</li>
</ul>
    `,
            descrizione: `Esempio`,
            codice: `
//Impostazioni palette dei colori
var brandColor = { name: "brand", color: "#FF7E21" };
var primaryColor = { name: "primary", color: "#69461E" };
var secondaryColor = { name: "secondary", color: "#61574C" };
var tertiaryColor = { name: "tertiary", color: "#1A406B" };

//Impostazioni di formattazione dei dati
var numberFormatter = { type: "number", stamp: (value) => { return value + "€" } };

//Impostazioni di interfaccia
const myInterface = {
        darkmode: false,
        radius: "4px",
        animation: "fast",
        palette: [ brandColor, primaryColor, secondaryColor, tertiaryColor ],
        font: "'Roboto', sans-serif",
}
//Oggetto che rappresenta le impostazioni dell'applicazione
var mySettings = {
    debug: true, //debug attivato
    debug_mode: "app", //specifica dell'applicazione da debuggare
    formatters: [ numberFormatter ],
    interface: myInterface
}
                            `,
        },
    ]
}