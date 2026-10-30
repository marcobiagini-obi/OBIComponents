import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { asyncDataLoader, obiAlert } from "../../core.js";
import { BASE_URL } from "../../obi.config.js";
import Doc from "../../src/models/Document.js";

const defaultUrl = `${BASE_URL}/resources/images/obi.png`;

defineComponent({
    selector: "obi-filecard",
    template: `<div size='sm' obi-card='file' interactable>
    <card-action cmd-if='actionsEnabled' size='xs' style='align-items: center;' padding='xs' display-row>
        <obi-chip relevance='danger' @click='delete' title='Cancella' interactable padding='xs'><obi-icon nome='delete'></obi-icon></obi-chip>
        <span flex-size='auto'></span>
        <obi-chip variant='filled' @click='stamp' title='stamp' interactable padding='xs'><obi-icon nome='print'></obi-icon></obi-chip>
    </card-action>
    <obi-cover size='xl' :link='previewUrl' @click='openFile' :tipo='getType' interactable></obi-cover>
    <card-header :titolo='$.label || $.document?.filename' :sottotitolo='$.descrizione || $.readableSize' :prepend='icon' @click='openFile'></card-header>
</div>`,
    options: {
        inputs: ["file", "icona", "label", "descrizione"],
        dataset: {
            document: new Doc(null, "File", { type: "application/octet-stream", lastModified: Date.now(), path: "", size: 0 }),
            label: "",
            descrizione: "",
            objectUrl: defaultUrl,
            previewUrl: defaultUrl
        },
        storage: {
            defaultUrl: defaultUrl,
        },
        computed: {
            modal: function () { return this.__element.querySelector("[obi-modal]").virtual; },
            icon: function () {
                if (this.icona) return `<obi-icon nome='${this.icona}'></obi-icon>`;
                if (!this.document) return `<obi-icon nome='image'></obi-icon>`;
                let name = "";
                let type = this.document.options?.type || getApplicationFromFileName(this.document.filename);
                switch (type) {
                    case "image/gif":
                    case "image/jpeg":
                    case "image/png": name = "image"; break;
                    case "application/pdf": name = "picture_as_pdf"; break;
                    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    case "application/vnd.ms-excel": name = "table_view"; break;
                    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    case "application/msword": name = "description"; break;
                    default: name = "draft"; break;
                }
                return `<obi-icon nome='${name}'></obi-icon>`;
            },
            readableSize: function () {
                return this.formatFileSize(this.document?.options?.size);
            },
            actionsEnabled: function () {
                return this.__element.hasAttribute("set-actions");
            }
        },
        actions: {
            async openFile() {
                let type = this.document.options.type || getApplicationFromFileName(this.document.filename);
                let application = !this.document ? "image" : type;
                if (application.includes("pdf") ||
                    application.includes("image") ||
                    application.includes("video") ||
                    application.includes("audio")) {
                    let url = await this.getObjectURL();
                    if (url) window.open(url, "_blank", 'location=yes,height=750,width=530,scrollbars=yes,status=yes');
                } else {
                    if (this.document?.options?.url) window.open(this.document.options.url, "_blank");
                    else this.download();
                }
            },
            async download() {
                const downloadLink = document.createElement("a");
                let url = await this.getObjectURL();
                if (!url) return;
                downloadLink.href = url
                downloadLink.download = this.document?.filename;
                downloadLink.click();
            },
            delete() {
                this.__node.trigger("remove", this.document);
            },
            stamp() {
                let iframe = this.__element.querySelector("iframe");
                if (iframe) {
                    try {
                        iframe.contentWindow.print();
                    } catch (ex) {
                        obiAlert("Non è stato possibile eseguire la stampa, aprire il file per stampare.", { type: "warninig" });
                        console.error(ex);
                    }
                } else {
                    this.__node.trigger("stamp", this.document);
                }
            },
            async getObjectURL() {
                try {
                    let url = await this.document?.getObjectURL();
                    this.objectUrl = url ?? defaultUrl;
                    return url;
                } catch (ex) {
                    console.error("Error getting object URL:", ex);
                }
            },
            formatFileSize(size) {
                return readableFileSize(size);
            },
            getType() {
                if (!this.document) return "image";
                switch (this.document.options.type || getApplicationFromFileName(this.document.filename)) {
                    case "image/gif":
                    case "image/jpeg":
                    case "image/png": return "image";
                    default: return "file";
                }
            },
            async setup(data) {
                if (!data) return;
                if (data instanceof Doc) {
                    this.document = data;
                } else if (data instanceof File || data instanceof Blob) {
                    this.document = await Doc.parseFile(data);
                } else if (typeof data === "string") {
                    if (/^https?:\/\//.test(data)) {
                        this.document = await Doc.parseUrl(data);
                    } else if (/^data:.*;base64,/.test(data)) {
                        const base64Data = data.split(',')[1];
                        const mimeMatch = data.match(/^data:(.*);base64,/);
                        const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";
                        this.document = new Doc(base64Data, "File", { type: mimeType });
                    } else {
                        this.document = new Doc(data, "File", { type: "application/octet-stream" });
                    }
                } else if (data instanceof Object && data.name && data.buffer) {
                    this.document = new Doc(data.buffer, data.name, { type: data.options?.type ?? getApplicationFromFileName(data.name), lastModified: data.options?.lastModified || Date.now(), path: data.path });
                } else if (data instanceof Object && data.nome && data.fileData) {
                    this.document = Doc.parseDBModel(data);
                } else if (data instanceof Object && data.filebits && data.filename) {
                    this.document = new Doc(data.filebits, data.filename, data.options);
                } else {
                    this.document = await Doc.parseUrl(defaultUrl);
                }
                if (this.document && !this.document.empty) {
                    let url = await this.getObjectURL().catch(ex => console.error("Error setting up document:", ex));
                    if (this.canDisplay() && url) this.previewUrl = url;
                }
            },
            canDisplay() {
                const supportedTypes = [
                    "image/png", "image/jpeg", "image/gif", "image/webp", "image/bmp", "image/svg+xml",
                    "application/pdf",
                    "video/mp4", "video/webm", "video/ogg",
                    "audio/mpeg", "audio/ogg", "audio/wav", "audio/webm",
                    "text/plain", "text/html", "text/csv"
                ];
                const type = this.document.options?.type || getApplicationFromFileName(this.document.filename);
                return supportedTypes.includes(type);
            }
        },
        events: [asyncDataLoader.call(this, async function () {
            await this.setup(this.file);
        })],
    }
});

function getApplicationFromFileName(filename) {
    if (filename) {
        let split = filename.split(".");
        let extension = split[split.length - 1];
        return {
            "aac": "audio/aac",
            "abw": "application/x-abiword",
            "arc": "application/x-freearc",
            "avi": "video/x-msvideo",
            "azw": "application/vnd.amazon.ebook",
            "bin": "application/octet-stream",
            "bmp": "image/bmp",
            "bz": "application/x-bzip",
            "bz2": "application/x-bzip2",
            "cda": "application/x-cdf",
            "csh": "application/x-csh",
            "css": "text/css",
            "csv": "text/csv",
            "doc": "application/msword",
            "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "eot": "application/vnd.ms-fontobject",
            "epub": "application/epub+zip",
            "gz": "application/gzip",
            "gif": "image/gif",
            "htm": "text/html",
            "html": "text/html",
            "ico": "image/vnd.microsoft.icon",
            "ics": "text/calendar",
            "jar": "application/java-archive",
            "jpeg": "image/jpeg",
            "jpg": "image/jpeg",
            "js": "text/javascript",
            "json": "application/json",
            "jsonld": "application/ld+json",
            "mid": "audio/midi audio/x-midi",
            "midi": "audio/midi audio/x-midi",
            "mjs": "text/javascript",
            "mp3": "audio/mpeg",
            "mp4": "video/mp4",
            "mpeg": "video/mpeg",
            "mpkg": "application/vnd.apple.installer+xml",
            "odp": "application/vnd.oasis.opendocument.presentation",
            "ods": "application/vnd.oasis.opendocument.spreadsheet",
            "odt": "application/vnd.oasis.opendocument.text",
            "oga": "audio/ogg",
            "ogv": "video/ogg",
            "ogx": "application/ogg",
            "opus": "audio/opus",
            "otf": "font/otf",
            "png": "image/png",
            "pdf": "application/pdf",
            "php": "application/x-httpd-php",
            "ppt": "application/vnd.ms-powerpoint",
            "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "rar": "application/vnd.rar",
            "rtf": "application/rtf",
            "sh": "application/x-sh",
            "svg": "image/svg+xml",
            "swf": "application/x-shockwave-flash",
            "tar": "application/x-tar",
            "tif": "image/tiff",
            "tiff": "image/tiff",
            "ts": "video/mp2t",
            "ttf": "font/ttf",
            "txt": "text/plain",
            "vsd": "application/vnd.visio",
            "wav": "audio/wav",
            "weba": "audio/webm",
            "webm": "video/webm",
            "webp": "image/webp",
            "woff": "font/woff",
            "woff2": "font/woff2",
            "xhtml": "application/xhtml+xml",
            "xls": "application/vnd.ms-excel",
            "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "xml": "application/xml",
            "xul": "application/vnd.mozilla.xul+xml",
            "zip": "application/zip",
            "3gp": "video/3gpp",
            "3g2": "video/3gpp2",
            "7z": "application/x-7z-compressed"
        }[extension] || "application/octet-stream";
    }
    return "";
}
function readableFileSize(attachmentSize) {
    const DEFAULT_SIZE = 0;
    const fileSize = attachmentSize ?? DEFAULT_SIZE;

    if (!fileSize) {
        return `${DEFAULT_SIZE} kb`;
    }

    const sizeInKb = fileSize / 1024;

    if (sizeInKb > 1024) {
        return `${(sizeInKb / 1024).toFixed(2)} mb`;
    } else {
        return `${sizeInKb.toFixed(2)} kb`;
    }
}