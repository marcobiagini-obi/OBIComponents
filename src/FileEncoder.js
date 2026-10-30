export default class FileEncoder {

    /**
     * Restituisce il buffer dei dati sottoforma di Blob
     *
     * @readonly
     * @type {*}
     */
    get file() { return new Blob([toArrayBuffer(this.filedata)]); }
    /**
     * Restituisce il file sottoforma di indirizzo url
     *
     * @readonly
     * @type {*}
     */
    get url() { return URL.createObjectURL(this.file); }

    constructor(buffer) {
        this.filedata = buffer;
    }
    /**
     * Scarica il file in locale
     *
     * @param {*} [filename=null] Permette di personalizzare il nome del file
     */
    download(filename = null) {
        try {
            const downloadLink = document.createElement("a");
            downloadLink.href = this.url;
            downloadLink.download = filename || this.file.filename;
            downloadLink.click();
        } catch (ex) {
            obiAlert("Si è verificato un problema nel download del file.", { type: "error" });
            console.error(ex);
        }
    }
    /**
     * Ottiene il buffer dei dati da un oggetto File all'interno di un file input
     *
     * @static
     * @async
     * @param {*} file
     * @returns {unknown}
     */
    static async fileBuffer(file) {
        return new Promise((resolve) => {
            var reader = new FileReader();
            reader.onloadend = () => { resolve(base64Encoder(reader.result)); }
            reader.onerror = () => obiAlert("Si è verificato un errore nel caricamento del file, si prega di riprovare.", { type: "error" });
            reader.readAsDataURL(file);
        });
    }

    static getArrayBuffer(input) {
        if (input instanceof ArrayBuffer) {
            return input;
        } else if (input instanceof Uint8Array || input instanceof Int8Array) {
            return input.buffer;
        } else if (typeof input === 'string') {
            return toArrayBuffer(input);
        } else if (input instanceof File || input instanceof Blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(toArrayBuffer(reader.result));
                reader.onerror = () => reject(new Error("Error reading file"));
                reader.readAsDataURL(input);
            });
        } else {
            throw new TypeError("Unsupported input type for ArrayBuffer conversion.");
        }
    }
}

/**
 * Converte una string in ArrayBuffer
 *
 * @param {*} string
 * @returns {*}
 */
function toArrayBuffer(string) {
    if (typeof string === 'string' && /^[A-Za-z0-9+/]+={0,2}$/.test(string.replace(/\s/g, ''))) {
        var binary_string = base64Decoder(string);
        var len = binary_string.length;
        var bytes = new Int8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
        //return StringToUint8Array(string).buffer;
    } else {
        console.warn("Input string " + string + " is not a valid base64 string.");
    }
}
/**
 * Codifica una stringa in base64
 *
 * @param {*} buffer
 * @returns {*}
 */
function base64Encoder(buffer) {
    let encoded = buffer.toString().replace(/^data:(.*,)?/, '');
    if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
    }
    return encoded;
}
/**
 * Decodifica una string da base64
 *
 * @param {*} str
 * @returns {*}
 */
function base64Decoder(str) {
    try {
        if (/^data:.*;base64,/.test(str)) str = str.split(',')[1];
        return window.atob(str);
    } catch (ex) {
        console.warn("Base64 decode error on content: ", str);
        console.error(ex);
        return "";
    }
}
