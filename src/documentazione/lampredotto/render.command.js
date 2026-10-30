export default {
    id: "docs.lampredotto.render.comandi",
    nome: "RenderModule - Comandi di Rendering",
    sezioni: [
        {
            titolo: "Introduzione",
            note: `I <strong>comandi di rendering</strong> sono attributi HTML personalizzati che <strong>RenderModule</strong> riconosce in fase di <mark>virtualizzazione dell'interfaccia</mark> per gestire il <mark>rendering dinamico</mark>.
            La loro funzione è quella di <mark>legare all'interfaccia i dati</mark> dell'applicazione fornendo le istruzioni su quali dati e come stamparli a schermo.
            
            I comandi disponibili sono cinque:
            <ul>
                <li><code>cmd-model</code>: Assegna i valori agli elementi a schermo o rende dinamico un input</li>
                <li><code>cmd-bind</code>: Rende dinamico un attributo dell'elemento html</li>
                <li><code>cmd-on</code>: Lega una funzione dell'applicazione ad un evento</li>
                <li><code>cmd-for</code>: Itera un elemento html per ogni istanza di una lista di dati</li>
                <li><code>cmd-if</code>: Visualizza l'elemento html in base al risultato di una condizione booleana</li>
            </ul>
            `,
            descrizione: `Riassunto comandi di rendering`,
            codice: `
.           |  Comando   |   Attributo   |  Scorciatoia |         Altri        |
             ──────────── ─────────────── ──────────────
            | dati       | cmd-model     | {{}}         |                      |
             ──────────── ─────────────── ──────────────
            | attributi  | cmd-bind:attr | :attr        |                      |
             ──────────── ─────────────── ──────────────
            | eventi     | cmd-on:event  | @event       |                      |
             ──────────── ─────────────── ──────────────
            | ciclo      | cmd-for       |              | cmd-filter, cmd-sort |
             ──────────── ─────────────── ──────────────
            | condizione | cmd-if        |              | cmd-elseif, cmd-else |
             ──────────── ─────────────── ──────────────
            `,
        },
    ]
}