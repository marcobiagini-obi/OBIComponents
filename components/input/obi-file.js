import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Support } from "../../LAMP/RenderModule/modules/library.js";
import { getIcon } from "../../src/support.js";
import { obiLoader, obiAlert } from "../../core.js";
import FileEncoder from "../../src/FileEncoder.js";
import Document from "../../src/models/Document.js";

defineComponent({
    selector: "obi-file",
    template:
        `<div obi-file :disabled='disabled' :invalid='!$.isValid()' :float-container='$.isIcon ? "hide" : null'>
            <div file-droparea @drop='dropFile' @dragover='allowDrop' @dragenter='dragFocus' @dragleave='dragBlur' @click='searchFile' :fill='$.files.length > 0' :disabled='disabled'>
                <span cmd-if='!$.files.length && !$.dragger' placeholder>Seleziona o trascina un file</span>
                <span cmd-elseif='dragger' placeholder><obi-icon nome='upload_file'></obi-icon> Rilascia il file</span>
                <div cmd-else display-column gap='sm'> 
                    <div file-item cmd-for='item in files' data-index=':index'>
                        <obi-icon :nome='item.icon'></obi-icon>
                        <div file-info>
                            <span :title='item.input.name'>{{item.input.name}}</span>
                            <span>{{$.getSize($.item.input.size)}}</span>
                        </div>
                        <obi-button @click='removeFile' :data-value="item.id" icon relevance='danger'><obi-icon nome='close'></obi-icon></obi-button>
                    </div>
                </div>
            </div>
            <div :floating-item='isIcon' options>
                <div relevance='neutral' display-row gap='sm' padding='md' rounded style='align-items: stretch;'>
                    <obi-button input-button :label='label' :relevance='relevance' :variant='variant' prepend='search' @click='searchFile' :disabled='disabled'></obi-button>
                    <group-component :hidden='noDriveLink'>
                        <obi-textbox placeholder='Link Google Drive' variant='outlined' style='margin: unset' :valore='driveLink'></obi-textbox>
                        <obi-button icon relevance='tertiary' @click='addDriveFile'><obi-icon nome="add_to_drive"></obi-icon></obi-button>
                    </group-component>
                </div>
            </div>
            <obi-button cmd-if='isIcon' title='Caricamento File' variant='filled' :relevance='relevance' icon @click='toggleOptions' float-toggle><obi-icon nome='attach_file'></obi-icon></obi-button>
            <input type='file' name='fileLoader' @change='selectFile' :multiple='isMultiple' :accept='accept'/>
        </div>`,
    options: {
        inputs: ["label", "valore", "accept", "relevance", "variant", "files"],
        dataset: {
            files: [],
            dragger: false,
            variant: "filled",
            label: "Carica File",
            driveLink: "",
            options: false,
        },
        computed: {
            isMultiple: function () {
                return this.__element.hasAttribute("multiple");
            },
            value: function () {
                return !this.isMultiple && this.files.length == 1 ? this.files[0].buffer : this.files.map(f => f.buffer);
            },
            required: function () {
                return this.__element.getAttribute("required") != null;
            },
            isIcon: function () {
                return this.__element.hasAttribute("icon");
            },
            viewOptions: function () {
                return this.isIcon ? this.options : true;
            },
            inputSettings: function () {
                return this.__element.getAttribute("input-settings") || null;
            },
            noDriveLink: function () { return this.inputSettings?.toLowerCase()?.includes("no-drive"); },
            disabled: function () { return this.__element.hasAttribute("disabled"); }
        },
        actions: {
            searchFile(evt) {
                try {
                    if (!evt.currentTarget.hasAttribute("disabled")) {
                        var target = evt.target;
                        var container = target.closest("[obi-file]");
                        var input = container.querySelector("input[type='file']");
                        input.click();
                    }
                } catch (ex) {
                    console.error(ex);
                }
            },
            async addFile(input) {
                try {
                    const file = {
                        id: Support.uniqueID(),
                        input: input,
                        buffer: await obiLoader(async function () { return await FileEncoder.fileBuffer(input); }, this.__node),
                        icon: getIcon(input.type),
                        url: this.driveLink ?? null,
                    }
                    if (this.isMultiple) { this.files.push(file); }
                    else { this.files.pop(); this.files.push(file); }
                    if (this.valore != undefined)
                        this.valore = this.isMultiple ? Array.from(this.value) : new Uint8Array(this.value);

                    this.__node.trigger("added", this.files);
                    return file;
                } catch (ex) {
                    obiAlert(ex.message, { type: "error" }, ex);
                    return null;
                }
            },
            addDriveFile() {
                if (this.driveLink) {
                    try {
                        let url = new URL(this.driveLink);
                        obiLoader(async () => {
                            const googleDriveRegex = /^(https?:\/\/)?(drive|docs)\.google\.com\/.*$/;
                            if (!googleDriveRegex.test(url.href)) throw new Error("Inserire un link a Google Drive valido");
                            const html = `<!DOCTYPE html>
                                <html>
                                    <head>
                                        <meta http-equiv="refresh" content="0; url='${this.driveLink}'" />
                                        <title>Redirecting...</title>
                                    </head>
                                    <body>
                                        <p>Redirecting to <a href="${this.driveLink}">${this.driveLink}</a></p>
                                    </body>
                                </html>`;
                            let input = new File([html], "google-drive-link.html", { type: "text/html" });
                            let res = await this.addFile(input);
                            if (res) this.driveLink = "";
                        }, this.__node);
                    } catch (ex) {
                        console.error("Error processing Google Drive link:", ex);
                        obiAlert(ex.message, { type: "error" }, ex);
                    }
                } else {
                    obiAlert("Inserisci un link valido di Google Drive", { type: "warning" });
                }
            },
            removeFile(evt) {
                evt.stopPropagation();
                let container = evt.currentTarget.closest("[file-item]");
                let index = container.getAttribute("data-index");
                if (index) {
                    index = parseInt(index);
                    if (index >= 0 && index < this.files.length) {
                        this.files.splice(index, 1);
                        this.__node.trigger("removed", this.files);
                    } else {
                        console.warn("Index out of bounds:", index);
                    }
                }
                if (this.valore != undefined) this.valore = this.value;
            },
            selectFile(evt) {
                obiLoader(async () => {
                    for (const file of evt.target.files) {
                        await this.addFile(file);
                    }
                }, this.__node);
                this.__element.querySelector("input").value = null;
            },
            dropFile(evt) {
                this.allowDrop(evt);
                this.dragger = false;
                obiLoader(async () => {
                    if (evt.dataTransfer.files && evt.dataTransfer.files.length > 0) {
                        for (const item of evt.dataTransfer.files) {
                            await this.addFile(item);
                        }
                    } else if (evt.dataTransfer.items && evt.dataTransfer.items.length > 0) {
                        for (const item of evt.dataTransfer.items) {
                            if (item.kind === "string") {
                                item.getAsString(async (str) => {
                                    // Optionally, check if it's a Google Drive link or handle as plain text
                                    await this.addFile(str);
                                });
                            }
                        }
                    }
                }, this.__node);
            },
            allowDrop(evt) {
                if (!evt.currentTarget.hasAttribute("disabled")) {
                    evt.stopPropagation();
                    evt.preventDefault();
                }
            },
            getSize(bytes) {
                bytes = parseFloat(bytes);
                if (bytes > 999999999999) return `${(bytes / 1000000000000).toFixed(2)}TB`;
                if (bytes > 999999999) return `${(bytes / 1000000000).toFixed(2)}GB`;
                if (bytes > 999999) return `${(bytes / 1000000).toFixed(2)}MB`;
                if (bytes > 999) return `${(bytes / 1000).toFixed(2)}KB`;
                return `${bytes}B`;
            },
            dragFocus(evt) {
                this.allowDrop(evt);
                if (!evt.currentTarget.hasAttribute("disabled")) this.dragger = true;
            },
            dragBlur(evt) {
                this.dragger = false;
            },
            getIcon(type) {
                return getIcon(type);
            },
            isValid() {
                let empty = Array.isArray(this.value) ? this.value?.length == 0 : this.value == null;
                return !this.required || this.required && !empty;
            },
            getDocuments() {
                return !this.isMultiple && this.files.length == 1 ?
                    new Document(this.files[0].buffer, this.files[0].input.name, {
                        type: this.files[0].input.type,
                        path: this.files[0].input.webkitRelativePath,
                        size: this.files[0].input.size,
                        url: this.files[0].url,
                    }) :
                    this.files.map(f => new Document(f.buffer, f.input.name, {
                        type: f.input.type,
                        path: f.input.webkitRelativePath,
                        size: f.input.size,
                        url: f.url,
                    }));
            },
            getInputs() {
                return !this.isMultiple && this.files.length == 1 ? this.files[0].input : this.files.map(f => f.input);
            },
            reset() {
                this.files = [];
                if (this.valore != undefined) this.valore = this.value;
            },
            toggleOptions() {
                this.options = !this.options;
            }
        },
    }
});