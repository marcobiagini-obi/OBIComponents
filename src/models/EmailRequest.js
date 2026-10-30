/**
 * @typedef {Object} Header
 * @property {string} sender - The sender's email address.
 * @property {string} from - The "from" email address.
 * @property {string} receiver - The receiver's email address.
 * @property {string} copy - The "cc" email addresses.
 * @property {string} blind - The "bcc" email addresses.
 * @property {string} subject - The subject of the email.
 * @property {string} link - The url for internal reference.
 */

/**
 * Contenitore di informazioni messaggi email per trasmissione HTTP.
 *
 * @export
 * @class EmailRequest
 * @typedef {EmailRequest}
 */
export default class EmailRequest {

    /** @type {Header} */
    header = {};
    content = [];
    files = [];
    /** @type {Invitation} */
    invitation = null;

    constructor(init = null) {
        if (init) Object.assign(this, init);
    }


    /**
     * Imposta un valore nell'header
     *
     * @param {*} key Proprietà dell'header
     * @param {*} value Valore della proprietò
     */
    setHeader(key, value) {
        Object.defineProperty(value, key.toLowerCase());
    }

    /**
     * Imposta un evento
     *
     * @param {*} start data e ora di inizio evento
     * @param {*} end data e ora di fine evento
     * @param {*} description descrizione dell'evento
     * @param {*} sender indirizzo email di chi invita
     */
    setInvitation(start, end, description, sender) {
        this.invitation = new Invitation(start, end, description, sender);
    }

    /**
     * Aggiunge un allegato
     *
     * @param {*} filename nome del file con estenzione
     * @param {*} content contenuto del file in Base64 string
     */
    addAttachment(filename, content) {
        this.files.push({ filename, content });
    }

}

/**
 * Oggetto invitation per creazione evento
 *
 * @export
 * @class Invitation
 * @typedef {Invitation}
 */
export class Invitation {

    constructor(start, end, description, sender = null) {

        let now = new Date();

        this.start = start ?? now;
        this.end = end ?? new Date(now.getTime() + 60 * 60 * 1000);
        this.description = description ?? "";
        this.sender = sender;
    }

}