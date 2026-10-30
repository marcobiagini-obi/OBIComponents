export default {
    id: "docs.components.stili",
    nome: "",
    sezioni: [
        {
            titolo: "DISPLAY",
            note: ``,
            descrizione: "FLEX",
            codice: `
[display-row] -> imposta la visualizzazione in riga
[display-row = 'wrap'] -> imposta la visualizzazione in riga con a capo automatico
[display-column] -> imposta la visualizzazione in colonna

//FLEX -> Proprietà di posizionamento delle flexbox
[flex-center]
[flex-start]
[flex-end]
[flex-around]
[flex-between]
[flex-evenly]
[flex-size='1-6 | unset']`,
        },
        {
            descrizione: "GRID",
            codice: `
[display-grid] { -> Imposta una griglia su 12 colonne
    & [grid-size='1-12'] -> imposta la dimensione del componente sulle colonne per la dimensione indicata
}

[display-grid='blog'] { -> imposta una griglia su 6 colonne
    & [grid-fullpage] -> imposta il componente su tutta la larghezza pagina
    & [grid-quote] -> imposta il componente dalla seconda colonna alla penultima
    & [grid-article] -> imposta il componente sulla terza e la quarta colonna

    //imposta l'inizio del componente sulla linea della colonna specificata
    & [grid-start='page-start | quote-start | article-start | page-middle | article-end | quote-end | page-end'] {
        //imposta la dimensione del componente per numero di colonne o per nome di colonna
        &[grid-size='1-6 | page-start | quote-start | article-start | page-middle | article-end | quote-end | page-end']
    }
}`,
        },
        {
            descrizione: "SPACES",
            codice: `
[margin='xs | sm | md | lg | xl']
[padding='xs | sm | md | lg | xl']`,
        },
        {
            titolo: "COLORS",
            descrizione: "BACKGROUND",
            codice: `
[relevance='brand | primary | secondary | tertiary | success | danger | warning | info | dark | neutral']`,
        },
        {
            descrizione: "COLOR",
            codice: `[text-color='brand | primary | secondary | tertiary | success | danger | warning | info | dark | neutral']`,
        },
        {
            titolo: 'FONT',
            descrizione: "TEXT",
            codice: `
[uppercase] -> Imposta tutto il testo in maiuscolo
[new-line] -> manda a capo il testo presente all'interno di un elemento html
[font-type='h1 | h2 | h3 | h4 | h5 | h6 | subtitle1 | subtitle2 | body1 | body2 | button | caption']`,
        },
        {
            titolo: "ALTRO",
            codice: `
[no-print] -> impedisce che l'elemento appaia in stampa
[rounded] -> arrotonda i bordi dell'elemento
[variant='filled | elevated | outlined'] -> pensati su card e button
[sizes='xs | sm | md | lg | xl | xxl'] -> definisce la dimensione del font`,
        }
    ]
}