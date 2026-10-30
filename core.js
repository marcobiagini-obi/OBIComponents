
//#region ADAPTER
import Service from "./LAMP/ServerModule/LampService.js";
import { Collection } from "./LAMP/RenderModule/modules/enumerators.js";
import { Support } from "./LAMP/RenderModule/modules/library.js";
import EventHandler from "./LAMP/RenderModule/modules/events.js";
import { elaborateMapsUrl, sendEmailToAssistenza, handleResponseError, fallbackCopyToClipboard } from "./src/support.js";
import { stampDateIta } from './components/input/obi-date.js';
import loader from "./components/interface/obi-loader.js";
import Dialog from './components/dialog/obi-alert.js';
import { localSettingsKey } from "./components/application/app-settings.js";

const dialog = Dialog.Instance;
/**
 * Metodo di stampa e interazione con messaggi a schermo
 * @param {*} message 
 * @param {*} options 
 */
export function obiAlert(message, options, exception = null) {

    if (exception != null) {
        if (options.actions == null) options.actions = [];
        options.actions.push({
            name: "Segnala",
            action: () => {
                const pageRef = location.href.replace(window.location.origin + "/", "");
                const errorMessage = exception.cause?.message ?? exception.message;
                const rawSubject = `Segnalazione errore da ${pageRef}`;
                const rawBody = `${errorMessage}\n\nStack Trace:\n${exception.stack}`;
                sendEmailToAssistenza(rawSubject, rawBody);
            },
            attributes: { variant: "filled" }
        });
        options.timer = 10000;
    }

    dialog.stamp(message, options);
}
/**
 * Stampa la data in formato gg/mm/aaaa
 *
 * @export
 * @param {*} datetime
 * @returns {*}
 */
export function obiStampDate(datetime) {

    if (typeof datetime == "string" && datetime.includes("T")) datetime = new Date(datetime);
    if (typeof datetime == "string" && datetime.includes("D")) datetime = new Date(datetime.replace(/\D/g, ''));

    return datetime instanceof Date ? stampDateIta(datetime) : datetime;
}
/**
 * Lega ad un processo asincrono un'animazione di caricamento su elementi a schermo
 *
 * @export
 * @param {*} action
 * @param {...{}} vnodes
 * @returns {*}
 */
export function obiLoader(action, ...vnodes) {
    return loader(action, ...vnodes);
}
/**
 * Imposta un trigger su evento per i nodi virtuali al cui interno poter definire dei processi di download dati senza interrompere il rendering
 *
 * @export
 * @param {*} action
 * @returns {{ name: any; action: (state: any) => any; }}
 */
export function asyncDataLoader(action) {
    return {
        name: Collection.node_event.progress,
        action: async function (state) {
            if (state == Collection.lifecycle.mounted) {
                action.call(this);
            }
        }
    }
}
/**
 * Restituisce un indirizzo url diverso a seconda se il sito gira su localHost o su server
 *
 * @export
 * @param {*} serverUrl indirizzo da restituire sul server
 * @param {*} localUrl indirizzo da restituire in local host
 * @returns {*}
 */
export function dynamicUrl(serverUrl, localUrl) {
    return isLocal() ? localUrl : serverUrl;
}
/**
 * Apre una pagina Google Maps con il percorso da un indirizzo di partenza ad uno di destinazione.
 *
 * @export
 * @param {*} start {indirizzo: string, citta: string, provincia: string, cap: string}
 * @param {*} dest {indirizzo: string, citta: string, provincia: string, cap: string}
 * @returns {string}
 */
export function obiMapsLink(start, dest) {
    window.open(elaborateMapsUrl(start, dest), "_blanck");
}
/**
 * Consente di ottenere l'url dinamico tra localhost e pubblicazione sul server
 *
 * @export
 * @param {*} serverPath : Percorso dell'applicativo sul server
 * @returns {string}
 */
export function obiProjectUrl(serverPath = "") {
    let uri = `${window.location.protocol}//${window.location.host}`;
    return dynamicUrl(`${uri}/${serverPath}`, uri);
}
/**
 * Unisce una lista di oggetti in uno solo
 *
 * @export
 * @param {*} datasets
 * @return {*} 
 */
export function combineObjects(...datasets) {
    return Object.assign({}, ...datasets.filter(obj => obj && typeof obj === 'object'));
}
/**
 * Importa i servizi api dinamicamente
 *
 * @export
 * @async
 * @param {...{}} params La lista di elementi con default da importare, per ultima opzionalmente può essere inserita una funzione per implementare le importazioni
 * @returns {unknown} 
 */
export async function loadApi(...params) {
    if (!window.obi) window.obi = {};
    if (!window.obi.localAPIs) window.obi.localAPIs = [];
    let action = typeof params[params.length - 1] == "function" ? params[params.length - 1] : null;
    var apis = [];
    for (const url of params) {
        if (typeof url == "string") {
            if (!window.obi?.localAPIs?.some(api => api.url === url)) {
                const apiModule = await import(url).then((module) => module.default);
                window.obi.localAPIs.push({ url: url, module: apiModule });
            }
            apis.push(window.obi.localAPIs.find(api => api.url === url).module);
        }
    }
    return action ? Promise.resolve(action(...apis)) : (apis.length === 1 ? apis[0] : apis);
}
/**
 * Controlla se l'host è in locale
 *
 * @export
 * @returns {*} 
 */
export function isLocal() {
    return window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1");
}
/** 
 * Gestisce le impostazioni locali dell'utente restituendo un oggetto con le proprietà salvate, o aggiornando le proprietà esistenti con quelle passate in input
 * @export
 * @param {object} [prop] Proprietà da aggiornare nelle impostazioni locali, se non specificato restituisce tutte le impostazioni salvate
 * @returns {object} Le impostazioni locali aggiornate o tutte le impostazioni se non sono state passate proprietà in input
 */
export function getLocalSettings() {
    return JSON.parse(localStorage.getItem(localSettingsKey));
}
/**
 * Gestisce le impostazioni locali dell'utente restituendo un oggetto con le proprietà salvate, o aggiornando le proprietà esistenti con quelle passate in input
 * @param {*} prop 
 * @returns 
 */
export function setLocalSettings(prop) {
    let settings = JSON.parse(localStorage.getItem(localSettingsKey)) || {};
    Object.assign(settings, prop);
    localStorage.setItem(localSettingsKey, JSON.stringify(settings));
    return settings;
}
/**
 * Gestisce gli errori di una chiamata API restituendo un messaggio più chiaro da mostrare a schermo
 * @export
 * @async
 * @param {*} ex 
 * @returns {*} 
 */
export async function handleAPIError(ex, options = null) {
    var message = await handleResponseError(ex);
    obiAlert(options?.message ?? message, { type: "error" }, ex);
    return options?.default ?? ex;
}
/**
 * Inizializza una classe limitando l'assegnazione dei valori alle sole proprietà già definite, evitando di sovrascrivere metodi o proprietà non previste
 * @param {*} init 
 * @returns 
 */
export function initClass(init) {
    if (this == null || this.constructor == null || init == null) return;
    if (typeof this == "object") {
        const allowedKeys = Object.keys(this);
        for (const key of allowedKeys) {
            if (key in init) this[key] = init[key];
        }
    }
}
//#endregion

//#region CLASSES
/**
 * Interfaccia di connessione al backend, permette di gestire un AbortController
 *
 * @export
 * @class iService
 * @typedef {iService}
 */
export class iService extends EventHandler {

    controllers = {};

    constructor() {
        super();
        this.resetController();
    }

    resetController(key) {
        this.abort(key, "Reset");
        if (key)
            Reflect.deleteProperty(this.controllers, key);
        else
            this.controllers = {};
    }
    addController(key) {
        if (!key) key = Support.uniqueID();
        if (this.controllers[key] != null) this.abort(key, "Replacement");
        this.controllers[key] = new AbortController();
        return this.controllers[key];
    }
    setController(key) {
        if (!key) key = Support.uniqueID();
        if (this.controllers[key] != null && !this.controllers[key].signal.aborted) return this.getController(key);
        return this.addController(key);
    }
    getController(key) {
        return this.controllers[key];
    }

    abort(key, reason = "Interruzione Forzata") {
        if (key) {
            if (!(key in this.controllers)) return;
            this.controllers[key].abort(reason);
            this.trigger("abort", key);
        }
        else {
            for (const key of Object.keys(this.controllers)) {
                this.abort(key, reason);
            }
        }
    }

    async fetchData(url, controller = null) {
        let data = await Service.Instance({ controller: this.setController(controller) }).getJson(url).catch((ex) => handleAPIError(ex, { message: "Errore durante il caricamento dei dati" }));
        return data ?? null;
    }
}
//#endregion