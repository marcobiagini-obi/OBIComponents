import MasterData from "./MasterData.js";
import FileEncoder from "../FileEncoder.js";
import { initClass } from "../../core.js";

class DBDocument extends MasterData {

    fileExtension = "";
    fileApplication = "";
    fileSize = 0;
    filePath = "";
    fileData = null;
    codice = "";
    idCategoria = 1;
    sourceCode = "";
    link = "";

    constructor(init) {
        super(init);
        initClass.call(this, init);
    }
}

export default class Doc {
    blob = null;
    dataUrl = "";
    filebits = null;
    filename = "";
    options = {
        type: "",
        endings: "transparent",
        lastModified: Date.now(),
        path: "",
        size: 0,
        url: "",
        id: 0,
        codice: "",
        idCategoria: 1,
        sourceCode: "",
    };

    get extension() { return this.filename.substring(this.filename.lastIndexOf('.') + 1); }
    get size() {
        if (this.options.size) return this.options.size;
        if (Array.isArray(this.filebits)) return this.filebits.length;
        if (typeof this.filebits === "string") return this.filebits.replaceAll('=', '').length * (3 / 4);
    }

    get empty() { return !this.filebits || this.filebits.length === 0; }

    constructor(fileContent, filename = "", options = null) {
        try {
            if (fileContent) this.setFileContent(fileContent);
            this.filename = filename;
            if (options) Object.assign(this.options, options);
        } catch (e) {
            console.error("Error initializing Doc:", e);
        }
    }

    async setFileContent(buffer) {
        if (!buffer) { console.warn("No file content provided, initializing empty Doc."); return; }
        if (buffer instanceof Blob || buffer instanceof File) {
            this.blob = buffer;
            this.filebits = new Uint8Array(await buffer.arrayBuffer());
        } else if (typeof buffer === "string") {
            this.filebits = new Uint8Array(FileEncoder.getArrayBuffer(buffer));
        } else if (buffer instanceof Uint8Array) {
            this.filebits = buffer;
        } else if (buffer instanceof ArrayBuffer) {
            this.filebits = new Uint8Array(buffer);
        } else {
            throw new Error("Invalid file bits provided.");
        }
        this.options.size = this.filebits.length;
    }

    getBlob() {
        if (this.blob) return this.blob;
        if (this.filebits instanceof Uint8Array) {
            this.blob = new File([this.filebits], this.filename, { type: this.options.type, lastModified: this.options.lastModified });
            return this.blob;
        }
        return null;
    }

    async getObjectURL() {
        const blob = this.getBlob();
        if (!blob) return "";
        // const sessionKey = `docurl_${this.options.id}`;
        // if (!this.options.path) this.options.path = sessionStorage.getItem(sessionKey) ?? URL.createObjectURL(blob);
        // sessionStorage.setItem(sessionKey, this.options.path);
        this.options.path = URL.createObjectURL(blob);
        return this.options.path;
    }

    destroy() {
        const sessionKey = `docurl_${this.options.id}`;
        const url = sessionStorage.getItem(sessionKey);
        if (url && url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
        }
        sessionStorage.removeItem(sessionKey);
        this.blob = null;
        this.filebits = null;
        this.dataUrl = "";
        this.filename = "";
        this.options = {
            type: "",
            endings: "transparent",
            lastModified: Date.now(),
            path: "",
            size: 0,
            url: "",
            id: 0,
            codice: "",
            idCategoria: 1,
            sourceCode: "",
        };
    }

    async getDBModel(options = {}) {
        if (!this.filename) throw new Error("Document must have a filename before generating DB model.");
        var buffer = this.dataUrl || await FileEncoder.fileBuffer(this.getBlob());
        var dataset = {
            id: this.options.id,
            nome: this.filename,
            idOwner: options.idUtente ?? 0,
            idLastUser: options.idUtente ?? 0,
            fileExtension: this.extension ?? "",
            fileApplication: this.options.type ?? "",
            fileSize: this.size ?? 0,
            filePath: (this.options.path || this.options.url) ?? "",
            fileData: buffer ?? null,
            codice: (options.codice || this.options.codice) ?? "",
            idCategoria: (options.idCategoria || this.options.idCategoria) ?? 0,
            sourceCode: (options.sourceCode || this.options.sourceCode) ?? "",
            link: this.options.url ?? "",
        }
        return new DBDocument(dataset);
    }

    static parseDBModel(model) {
        return new Doc(model.fileData, model.nome, {
            type: model.fileApplication,
            size: model.fileSize,
            path: model.filePath,
            id: model.id,
            codice: model.codice || "",
            idCategoria: model.idCategoria || 1,
            sourceCode: model.sourceCode || "",
            url: model.link ?? "",
        });
    }

    static async parseUrl(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            // Extract filename from URL if possible
            let filename = "File";
            try {
                const urlParts = data.split('/');
                const lastPart = urlParts[urlParts.length - 1];
                filename = decodeURIComponent(lastPart.split('?')[0]) || "File";
            } catch (e) {
                filename = "File";
            }
            return new Doc(blob, filename, { type: blob.type, lastModified: Date.now(), url: url });
        } catch (e) {
            throw new Error("Failed to fetch document from URL: " + e.message);
        }
    }

    static async parseFile(data) {
        if (data instanceof File || data instanceof Blob) {
            const buffer = await data.arrayBuffer();
            return new Doc(new Uint8Array(buffer), data.name ?? "File", { type: data.type, lastModified: data.lastModified ?? Date.now() });
        } else {
            throw new Error("Provided input is not a valid File object.");
        }
    }
}