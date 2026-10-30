import MasterData from './MasterData.js';
import { initClass } from '../../core.js';

class DBUtente extends MasterData {
    codice = "";
    cognome = '';
    email = '';
    username = '';
    password = '';
    profilo = '';
    ruolo = '';
    idRuolo = 0;
    betaAccess = false;
    lastAccess = null;

    idAccesso = 0;
    accesso = '';
    iconaAccesso = '';

    constructor(data = null) {
        super(data);
        if (data) initClass.call(this, data);
    }

    clone() {
        return new DBUtente(this);
    }
}

class DBProgetto extends MasterData {
    idTipo = 0;
    idStato = 1;
    idAmbito = 0;
    refHelpLine = '';
    installazione = '';
    installazioneDev = '';
    installazioneBeta = '';
    versione = '1.0';
    codice = '';
    label = '';
    logoUrl = '';
    nomeDatabase = '';
    accesso = '';

    constructor(data = null) {
        super(data);
        if (data) initClass.call(this, data);
    }

    clone() {
        return new DBProgetto(this);
    }
}

class Sessione {
    progetto = 0;
    id = "";
    negozi = [];
    attivo = 0;

    get negozio() { return this.negozi.find(n == n.id == attivo); }

    constructor(init = null) {
        if (init) Object.assign(this, init);
    }
}

class Progetto extends DBProgetto {

    utenti = [];
    ruoli = [];

    tipo = "";
    stato = "";
    ambito = "";

    constructor(data = null) {
        super(data);
        if (data) Object.assign(this, data);
    }

    toDBModel() {
        return this.clone();
    }
}

class Utente extends DBUtente {

    negozi = [];
    fornitori = [];
    negoziProgetto = [];
    progetti = [];
    selected = false;
    sessioni = [];
    token = "";

    get nominativo() { return `${this.nome} ${this.cognome}`; }
    get negoziSessione() { }

    constructor(data = null) {
        super(data);
        if (data) Object.assign(this, data);
    }

    toDBModel() {
        return this.clone();
    }

    getSessione(progetto) { return this.sessioni.find(s => s.progetto == progetto); }

    setNegozioAttivo(progetto, negozio) {
        let sessione = this.getSessione(progetto);
        if (sessione) sessione.attivo = Number(negozio);
    }
}

export { Sessione, Progetto, Utente };