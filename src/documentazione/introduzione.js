import { BASE_URL } from "../../obi.config.js";

export default {
    id: "home",
    nome: "Introduzione",
    sezioni: [
        {
            titolo: "Benvenuti nel Playground",
            descrizione: null,
            note: `Questo sito ha lo scopo di fornire una documentazione e una guida all'utilizzo del pacchetto di componenti grafici <strong>OBI Components</strong>.
                                    
                                    Dal menu di navigazione è possibile accedere alla documentazione ed al dettaglio del pacchetto dei componenti grafici.`,
            codice: null,
        },
        {
            titolo: "OBI Components",
            descrizione: `Importazione di OBI Components`,
            note: `
<strong>OBI Components</strong> è il pacchetto di componenti standard per la progettazione di interfacce per applicativi OBI.
I componenti sono basati sul framework opensource <strong>Lampredotto JS</strong>.
Per usare i componenti OBI basta copiare il codice sotto all'interno dell'header della pagina principale del progetto.
                        `,
            codice: `
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,300,0,-25"  />
<link type='text/css' rel='stylesheet' href='${BASE_URL}/style/StyleBundle.css' >
<script type='module' src='${BASE_URL}/componentsBundle.js'></scr` + `ipt>`,
        }
    ]
}