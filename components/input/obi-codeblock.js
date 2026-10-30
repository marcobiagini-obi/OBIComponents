import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";
import { fallbackCopyToClipboard } from "../../src/support.js";

const SUPPORTED_LANGUAGES = [
    { label: "JSON", value: "json" },
    { label: "JavaScript", value: "javascript" },
    { label: "CSS", value: "css" },
    { label: "HTML", value: "html" },
    { label: "Visual Basic", value: "vb" },
    { label: "C#", value: "c#" },
    { label: "SQL", value: "sql" }
];

//#region COMPONENT DEFINITION
defineComponent({
    selector: "obi-codeblock",
    template: `
        <div obi-codeblock :disabled="disabled" :readonly="readonly" :invalid="invalid">
            <div codeblock-header>
                <div header-left>
                    <span class="material-symbols-outlined" header-icon>code</span>
                    <label cmd-if="$.label" header-label>{{label}}</label>
                    <select language-select :disabled="disabled" @change="changeLanguage">
                        <option cmd-for="lang in languageList" :value="lang.value" :selected="$.currentLanguage == $.lang.value">{{lang.label}}</option>
                    </select>
                </div>
                <div header-right>
                    <span code-stats>{{stats}}</span>
                    <button action-btn format-btn type="button" title="Formatta codice (Alt+Shift+F)" :disabled="disabled || readonly" @click="format">
                        <span class="material-symbols-outlined">auto_fix_high</span>
                        <span btn-text>Format</span>
                    </button>
                    <button action-btn type="button" title="Copia negli appunti" @click="copy">
                        <span class="material-symbols-outlined">{{copyIcon}}</span>
                        <span btn-text cmd-if="$.isCopied">Copiato!</span>
                    </button>
                    <button action-btn type="button" title="Cancella tutto" cmd-if="!disabled && !readonly" @click="clear">
                        <span class="material-symbols-outlined">delete_outline</span>
                    </button>
                </div>
            </div>

            <div codeblock-body :style="$.bodyStyle">
                <div line-numbers aria-hidden="true">
                    <span>1</span>
                </div>
                <div editor-area>
                    <textarea
                        cmd-model="valore"
                        :placeholder="placeholder"
                        :disabled="disabled"
                        :readonly="readonly"
                        spellcheck="false"
                        autocomplete="off"
                        autocorrect="off"
                        autocapitalize="off"
                        @input="onInput"
                        @scroll="onScroll"
                        @keydown="onKeyDown"></textarea>
                    <pre aria-hidden="true"><code code-highlight></code></pre>
                </div>
            </div>

            <div codeblock-footer cmd-if="$.messaggio || $.statusMessage">
                <span footer-message :class="$.statusType">{{statusMessage || messaggio}}</span>
                <span footer-tip>Tab: indent • Shift+Tab: outdent • Alt+Shift+F: format</span>
            </div>
        </div>
    `,
    options: {
        inputs: [
            "label", "valore", "value", "language", "lang", "placeholder",
            "messaggio", "readonly", "disabled", "invalid", "height"
        ],
        dataset: {
            valore: "",
            language: "javascript",
            lang: "",
            label: "",
            placeholder: "Inserisci o incolla il codice qui...",
            messaggio: "",
            readonly: false,
            disabled: false,
            invalid: false,
            height: "280px",
            copyIcon: "content_copy",
            isCopied: false,
            statusMessage: "",
            statusType: "",
            statusTimer: null,
            languageList: SUPPORTED_LANGUAGES
        },
        computed: {
            currentLanguage() {
                const l = (this.language || this.lang || "javascript").toString().toLowerCase().trim();
                if (l === "js") return "javascript";
                if (l === "csharp" || l === "cs") return "c#";
                if (l === "visualbasic" || l === "vbnet" || l === "vb.net") return "vb";
                if (l === "xml") return "html";
                return l;
            },
            stats() {
                const text = this.valore != null ? String(this.valore) : "";
                const lines = text ? text.split("\n").length : 1;
                const chars = text.length;
                return `${lines} lin • ${chars} car`;
            },
            bodyStyle() {
                return this.height ? `height: ${this.height}` : "";
            }
        },
        actions: {
            init() {
                if (this.value != null && (this.valore == null || this.valore === "")) {
                    this.valore = this.value;
                }
                this.updateView();
            },
            onInput(evt) {
                if (evt && evt.target) {
                    this.valore = evt.target.value;
                }
                this.updateView();
                this.__node.trigger("input", this.valore);
                this.__node.trigger("changed", this.valore);
                this.__node.trigger("change", this.valore);
            },
            onScroll(evt) {
                const textarea = evt ? evt.currentTarget : this.__element.querySelector("textarea");
                if (!textarea) return;
                const pre = this.__element.querySelector("pre");
                const gutter = this.__element.querySelector("[line-numbers]");
                if (pre) {
                    pre.scrollTop = textarea.scrollTop;
                    pre.scrollLeft = textarea.scrollLeft;
                }
                if (gutter) {
                    gutter.scrollTop = textarea.scrollTop;
                }
            },
            onKeyDown(evt) {
                const textarea = evt.currentTarget;
                if (!textarea) return;

                // Shortcut: Alt+Shift+F or Ctrl+Shift+F for format
                if (evt.shiftKey && (evt.altKey || evt.ctrlKey) && (evt.key === "f" || evt.key === "F")) {
                    evt.preventDefault();
                    this.format();
                    return;
                }

                // Handle TAB key (indent / outdent)
                if (evt.key === "Tab") {
                    evt.preventDefault();
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const val = textarea.value;
                    const tabSpaces = "  "; // 2 spaces

                    if (start === end) {
                        // Single cursor insertion
                        if (!evt.shiftKey) {
                            textarea.value = val.substring(0, start) + tabSpaces + val.substring(end);
                            textarea.selectionStart = textarea.selectionEnd = start + tabSpaces.length;
                        }
                    } else {
                        // Multi-line selection: indent or outdent lines
                        const startLineIndex = val.lastIndexOf("\n", start - 1) + 1;
                        const endLineIndex = val.indexOf("\n", end);
                        const sliceEnd = endLineIndex === -1 ? val.length : endLineIndex;
                        const selectedBlock = val.substring(startLineIndex, sliceEnd);
                        const lines = selectedBlock.split("\n");

                        let modifiedBlock;
                        if (evt.shiftKey) {
                            // Outdent
                            modifiedBlock = lines.map(line => line.startsWith(tabSpaces) ? line.substring(tabSpaces.length) : line.replace(/^\s/, "")).join("\n");
                        } else {
                            // Indent
                            modifiedBlock = lines.map(line => tabSpaces + line).join("\n");
                        }

                        textarea.value = val.substring(0, startLineIndex) + modifiedBlock + val.substring(sliceEnd);
                        textarea.selectionStart = startLineIndex;
                        textarea.selectionEnd = startLineIndex + modifiedBlock.length;
                    }

                    this.valore = textarea.value;
                    this.updateView();
                    this.__node.trigger("changed", this.valore);
                    return;
                }

                // Handle ENTER key (auto-indent)
                if (evt.key === "Enter") {
                    const start = textarea.selectionStart;
                    const val = textarea.value;
                    const lineStart = val.lastIndexOf("\n", start - 1) + 1;
                    const currentLine = val.substring(lineStart, start);
                    const match = currentLine.match(/^(\s+)/);
                    let indent = match ? match[1] : "";

                    // If previous line ends with '{', '(', '[', or ':', add extra indent
                    if (/[\{\(\[\:]\s*$/.test(currentLine)) {
                        indent += "  ";
                    }

                    if (indent) {
                        evt.preventDefault();
                        const insert = "\n" + indent;
                        textarea.value = val.substring(0, start) + insert + val.substring(textarea.selectionEnd);
                        textarea.selectionStart = textarea.selectionEnd = start + insert.length;
                        this.valore = textarea.value;
                        this.updateView();
                        this.__node.trigger("changed", this.valore);
                    }
                }
            },
            changeLanguage(evt) {
                const newLang = evt.target.value;
                this.language = newLang;
                this.lang = newLang;
                this.updateView();
                this.showStatus(`Linguaggio impostato su ${newLang.toUpperCase()}`, "success", 2000);
                this.__node.trigger("languagechange", newLang);
            },
            format() {
                if (this.disabled || this.readonly) return;
                const raw = this.valore != null ? String(this.valore) : "";
                if (!raw.trim()) return;

                try {
                    const lang = this.currentLanguage;
                    const formatted = formatCode(raw, lang);
                    this.valore = formatted;
                    this.invalid = false;

                    const textarea = this.__element.querySelector("textarea");
                    if (textarea) {
                        textarea.value = formatted;
                    }

                    this.updateView();
                    this.showStatus(`Formattazione completata (${lang.toUpperCase()})`, "success", 3000);
                    this.__node.trigger("input", this.valore);
                    this.__node.trigger("changed", this.valore);
                    this.__node.trigger("formatted", { language: lang, code: this.valore });
                } catch (err) {
                    this.invalid = true;
                    this.showStatus(`Errore formattazione: ${err.message}`, "error", 5000);
                }
            },
            async copy() {
                const text = this.valore != null ? String(this.valore) : "";
                if (!text) return;

                let copied = false;
                if (navigator.clipboard && window.isSecureContext) {
                    try {
                        await navigator.clipboard.writeText(text);
                        copied = true;
                    } catch {
                        copied = false;
                    }
                }
                if (!copied) {
                    fallbackCopyToClipboard(text);
                    copied = true;
                }

                if (copied) {
                    this.copyIcon = "check";
                    this.isCopied = true;
                    this.showStatus("Codice copiato negli appunti!", "success", 2500);
                    setTimeout(() => {
                        this.copyIcon = "content_copy";
                        this.isCopied = false;
                    }, 2000);
                }
            },
            clear() {
                if (this.disabled || this.readonly) return;
                this.valore = "";
                const textarea = this.__element.querySelector("textarea");
                if (textarea) textarea.value = "";
                this.updateView();
                this.showStatus("Codice cancellato", "success", 2000);
                this.__node.trigger("input", "");
                this.__node.trigger("changed", "");
                this.__node.trigger("clear");
            },
            updateView() {
                const text = this.valore != null ? String(this.valore) : "";
                const codeEl = this.__element.querySelector("[code-highlight]");
                const gutter = this.__element.querySelector("[line-numbers]");

                // 1. Update Syntax Highlighting
                if (codeEl) {
                    codeEl.innerHTML = highlightCode(text, this.currentLanguage);
                }

                // 2. Update Line Numbers Gutter
                if (gutter) {
                    const lines = text.split("\n");
                    const count = Math.max(1, lines.length);
                    let nums = "";
                    for (let i = 1; i <= count; i++) {
                        nums += `<span>${i}</span>`;
                    }
                    gutter.innerHTML = nums;
                }

                // 3. Keep scroll aligned
                this.onScroll();
            },
            showStatus(message, type = "success", duration = 3000) {
                clearTimeout(this.statusTimer);
                this.statusMessage = message;
                this.statusType = type;
                this.statusTimer = setTimeout(() => {
                    this.statusMessage = "";
                    this.statusType = "";
                }, duration);
            }
        },
        events: [
            {
                name: Collection.node_event.progress,
                action: function (state) {
                    if (state === Collection.lifecycle.mounted) {
                        this.init();
                    }
                }
            }
        ]
    }
});
//#endregion

//#region TEST / DOCUMENTATION COMPONENT
defineComponent({
    selector: "obi-codeblock-component",
    template: `
        <test-template name="OBI CODEBLOCK" note="Casella di input per codice sorgente con evidenziazione sintattica e formattazione per JSON, JavaScript, CSS, HTML, Visual Basic, C# e SQL" :code="sampleCode">
            <section actions slot="actions">
                <obi-select :valore="sampleLang" label="Linguaggio" :opzioni="langOptions" @changed="onLangSelect"></obi-select>
                <obi-checkbox label="Disabilitato" :valore="sampleDisabled" button></obi-checkbox>
                <obi-checkbox label="Solo Lettura" :valore="sampleReadonly" button></obi-checkbox>
                <div style="margin-top: 16px; width: 100%;">
                    <obi-codeblock
                        :language="sampleLang"
                        :valore="sampleCode"
                        :label="'Editor ' + sampleLang.toUpperCase()"
                        :disabled="sampleDisabled"
                        :readonly="sampleReadonly"
                        height="320px"></obi-codeblock>
                </div>
            </section>
        </test-template>
    `,
    options: {
        dataset: {
            sampleLang: "javascript",
            sampleDisabled: false,
            sampleReadonly: false,
            langOptions: SUPPORTED_LANGUAGES,
            samples: {
                json: '{\n  "app": "OBIComponents",\n  "version": "2.0.0",\n  "features": ["highlighting", "formatting", "line-numbers"],\n  "languages": ["json", "javascript", "css", "html", "vb", "c#", "sql"]\n}',
                javascript: 'function calculateDiscount(price, percentage) {\n  if (percentage <= 0) return price;\n  const discount = (price * percentage) / 100;\n  return Number((price - discount).toFixed(2));\n}',
                css: '.obi-card {\n  display: flex;\n  flex-direction: column;\n  padding: 16px;\n  background-color: #ffffff;\n  border-radius: 8px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}',
                html: '<div class="product-item" data-id="101">\n  <h2 class="title">Trapano Avvitatore</h2>\n  <span class="price">€ 89,90</span>\n  <button type="button" class="btn-buy">Aggiungi al carrello</button>\n</div>',
                vb: 'Public Function CalcolaPrezzoIvato(ByVal prezzoNetto As Double, ByVal aliquotaIva As Double) As Double\n    Dim totaleIva As Double = (prezzoNetto * aliquotaIva) / 100\n    Return prezzoNetto + totaleIva\nEnd Function',
                "c#": 'using System;\n\nnamespace ObiApp\n{\n    public class Articolo\n    {\n        public int Codice { get; set; }\n        public string Descrizione { get; set; }\n        public decimal Prezzo { get; set; }\n    }\n}',
                sql: 'SELECT a.Codice, a.Descrizione, a.Prezzo, c.NomeCategoria\nFROM Articoli a\nINNER JOIN Categorie c ON a.IdCategoria = c.Id\nWHERE a.Attivo = 1 AND a.Prezzo > 50\nORDER BY a.Prezzo DESC\nLIMIT 20;'
            }
        },
        computed: {
            sampleCode() {
                return this.samples[this.sampleLang] || this.samples.javascript;
            }
        },
        actions: {
            onLangSelect(evt) {
                const val = evt && evt.value ? evt.value : evt;
                if (val) this.sampleLang = val;
            }
        }
    }
});
//#endregion

//#region CODE FORMATTERS
export function formatCode(code, language) {
    if (!code || !code.trim()) return code;
    const l = (language || "").toLowerCase().trim();

    if (l === "json") return formatJson(code);
    if (l === "javascript" || l === "js") return formatJavascript(code);
    if (l === "css") return formatCss(code);
    if (l === "html" || l === "xml") return formatHtml(code);
    if (l === "vb" || l === "vbnet" || l === "vb.net" || l === "visualbasic") return formatVb(code);
    if (l === "c#" || l === "csharp" || l === "cs") return formatCsharp(code);
    if (l === "sql") return formatSql(code);

    return code;
}

export function formatJson(code, indent = 2) {
    if (!code || !code.trim()) return code;
    try {
        const parsed = JSON.parse(code);
        return JSON.stringify(parsed, null, indent);
    } catch (e) {
        try {
            const relaxed = Function('"use strict";return (' + code + ')')();
            return JSON.stringify(relaxed, null, indent);
        } catch {
            throw new Error("JSON non valido: " + e.message);
        }
    }
}

export function formatJavascript(code, indentSize = 2) {
    if (!code || !code.trim()) return code;
    const indent = " ".repeat(indentSize);

    let clean = code.replace(/\r\n/g, "\n").trim();
    let result = "";
    let level = 0;
    let inString = false;
    let stringChar = "";
    let inLineComment = false;
    let inBlockComment = false;
    let inForHeader = false;
    let parenDepth = 0;
    let buffer = "";

    for (let i = 0; i < clean.length; i++) {
        const char = clean[i];
        const next = clean[i + 1];

        if (inLineComment) {
            buffer += char;
            if (char === "\n") {
                inLineComment = false;
                result += buffer.trimEnd() + "\n" + indent.repeat(level);
                buffer = "";
            }
            continue;
        }

        if (inBlockComment) {
            buffer += char;
            if (char === "*" && next === "/") {
                buffer += next;
                i++;
                inBlockComment = false;
            }
            continue;
        }

        if (inString) {
            buffer += char;
            if (char === stringChar && clean[i - 1] !== "\\") {
                inString = false;
            }
            continue;
        }

        if (char === "/" && next === "/") {
            inLineComment = true;
            buffer += "//";
            i++;
            continue;
        }

        if (char === "/" && next === "*") {
            inBlockComment = true;
            buffer += "/*";
            i++;
            continue;
        }

        if (char === '"' || char === "'" || char === "`") {
            inString = true;
            stringChar = char;
            buffer += char;
            continue;
        }

        if (char === "(") {
            parenDepth++;
            if (buffer.trim().endsWith("for")) inForHeader = true;
            buffer += char;
            continue;
        }
        if (char === ")") {
            parenDepth = Math.max(0, parenDepth - 1);
            if (parenDepth === 0) inForHeader = false;
            buffer += char;
            continue;
        }

        if (char === "{") {
            const trimmed = buffer.trim();
            buffer = "";
            if (trimmed) {
                result += (result && !result.endsWith("\n") && !result.endsWith(" ") ? " " : "") + trimmed + " {\n";
            } else {
                result += "{\n";
            }
            level++;
            result += indent.repeat(level);
        } else if (char === "}") {
            const trimmed = buffer.trim();
            buffer = "";
            if (trimmed) {
                result += trimmed + (trimmed.endsWith(";") ? "" : ";") + "\n";
            }
            level = Math.max(0, level - 1);
            result += (result && !result.endsWith("\n") ? "\n" : "") + indent.repeat(level) + "}\n";
            result += indent.repeat(level);
        } else if (char === ";" && !inForHeader) {
            buffer += char;
            result += buffer.trim() + "\n" + indent.repeat(level);
            buffer = "";
        } else if (char === "\n") {
            if (buffer.trim()) buffer += " ";
        } else {
            buffer += char;
        }
    }

    if (buffer.trim()) {
        result += buffer.trim();
    }

    return result.replace(/\n\s*\n\s*\n+/g, "\n\n").trim();
}

export function formatCss(code, indentSize = 2) {
    if (!code || !code.trim()) return code;
    const indent = " ".repeat(indentSize);
    let result = "";
    let level = 0;
    let clean = code.replace(/\r\n/g, "\n").trim();

    let inComment = false;
    let inString = false;
    let stringChar = "";
    let buffer = "";

    for (let i = 0; i < clean.length; i++) {
        const char = clean[i];
        const next = clean[i + 1];

        if (inComment) {
            buffer += char;
            if (char === "*" && next === "/") {
                buffer += next;
                i++;
                inComment = false;
                result += buffer + "\n" + indent.repeat(level);
                buffer = "";
            }
            continue;
        }

        if (inString) {
            buffer += char;
            if (char === stringChar && clean[i - 1] !== "\\") {
                inString = false;
            }
            continue;
        }

        if (char === "/" && next === "*") {
            inComment = true;
            buffer += "/*";
            i++;
            continue;
        }

        if (char === '"' || char === "'") {
            inString = true;
            stringChar = char;
            buffer += char;
            continue;
        }

        if (char === "{") {
            const selector = buffer.trim();
            buffer = "";
            result += (result && !result.endsWith("\n") ? " " : "") + selector + " {\n";
            level++;
            result += indent.repeat(level);
        } else if (char === "}") {
            const trimmed = buffer.trim();
            buffer = "";
            if (trimmed) {
                result += trimmed + (trimmed.endsWith(";") ? "" : ";") + "\n";
            }
            level = Math.max(0, level - 1);
            result += indent.repeat(level) + "}\n";
            if (level === 0) result += "\n";
            result += indent.repeat(level);
        } else if (char === ";") {
            buffer += char;
            result += buffer.trim() + "\n" + indent.repeat(level);
            buffer = "";
        } else if (char === "\n") {
            if (buffer.trim()) buffer += " ";
        } else {
            buffer += char;
        }
    }

    if (buffer.trim()) {
        result += buffer.trim();
    }

    return result.replace(/\n\s*\n\s*\n+/g, "\n\n").trim();
}

export function formatHtml(html, indentSize = 2) {
    if (!html || !html.trim()) return html;
    const indent = " ".repeat(indentSize);

    const voidElements = new Set([
        "area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr"
    ]);

    let formatted = "";
    let level = 0;
    const tokens = html.replace(/\r\n/g, "\n").match(/(<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[a-zA-Z0-9:-]+(?:\s+[^>]*)?\/?>|[^<]+)/gi) || [];

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i].trim();
        if (!token) continue;

        if (token.startsWith("<!--")) {
            formatted += indent.repeat(level) + token + "\n";
        } else if (token.toUpperCase().startsWith("<!DOCTYPE")) {
            formatted += token + "\n";
        } else if (token.startsWith("</")) {
            level = Math.max(0, level - 1);
            formatted += indent.repeat(level) + token + "\n";
        } else if (token.startsWith("<")) {
            const tagMatch = token.match(/^<([a-zA-Z0-9:-]+)/);
            const tagName = tagMatch ? tagMatch[1].toLowerCase() : "";
            const isSelfClosing = token.endsWith("/>") || voidElements.has(tagName);

            const nextToken = tokens[i + 1]?.trim();
            const afterNext = tokens[i + 2]?.trim();
            if (!isSelfClosing && nextToken && !nextToken.startsWith("<") && afterNext === `</${tagName}>`) {
                formatted += indent.repeat(level) + token + nextToken + afterNext + "\n";
                i += 2;
            } else {
                formatted += indent.repeat(level) + token + "\n";
                if (!isSelfClosing) level++;
            }
        } else {
            formatted += indent.repeat(level) + token + "\n";
        }
    }

    return formatted.trim();
}

export function formatVb(code, indentSize = 4) {
    if (!code || !code.trim()) return code;
    const indent = " ".repeat(indentSize);

    const blockOpeners = /^(?:Public\s+|Private\s+|Protected\s+|Friend\s+|Shared\s+|Overrides\s+)*(?:Sub\b|Function\b|Property\b|Class\b|Module\b|Structure\b|Interface\b|Enum\b|Try\b|While\b|Do\b|For\b|Using\b|With\b|Select\s+Case\b)/i;
    const blockClosers = /^(?:End\s+(?:Sub|Function|Property|Class|Module|Structure|Interface|Enum|If|While|Try|Using|With|Select)\b|Next\b|Loop\b|Wend\b)/i;
    const blockMid = /^(?:Else\b|ElseIf\b|Catch\b|Finally\b|Case\b)/i;

    const keywords = [
        "AddHandler", "AddressOf", "Alias", "And", "AndAlso", "As", "Boolean", "ByRef", "Byte", "ByVal",
        "Call", "Case", "Catch", "CBool", "CByte", "CChar", "CDate", "CDbl", "CDec", "Char", "CInt",
        "Class", "CLng", "CObj", "Const", "Continue", "CSByte", "CShort", "CSng", "CStr", "CType",
        "CUInt", "CULng", "CUShort", "Date", "Decimal", "Declare", "Default", "Delegate", "Dim",
        "DirectCast", "Do", "Double", "Each", "Else", "ElseIf", "End", "EndIf", "Enum", "Erase",
        "Error", "Event", "Exit", "False", "Finally", "For", "Friend", "Function", "Get", "GetType",
        "Global", "GoSub", "GoTo", "Handles", "If", "Implements", "Imports", "In", "Inherits",
        "Integer", "Interface", "Is", "IsNot", "Let", "Lib", "Like", "Long", "Loop", "Me", "Mod",
        "Module", "MustInherit", "MustOverride", "MyBase", "MyClass", "Namespace", "New", "Next",
        "Not", "Nothing", "Object", "Of", "On", "Operator", "Option", "Optional", "Or", "OrElse",
        "Out", "Overloads", "Overridable", "Overrides", "ParamArray", "Partial", "Private", "Property",
        "Protected", "Public", "RaiseEvent", "ReadOnly", "ReDim", "REM", "RemoveHandler", "Resume",
        "Return", "Select", "Set", "Shadows", "Shared", "Short", "Single", "Static", "Step", "Stop",
        "String", "Structure", "Sub", "SyncLock", "Then", "Throw", "To", "True", "Try", "TryCast",
        "TypeOf", "Using", "Variant", "Wend", "When", "While", "With", "WithEvents", "WriteOnly", "Xor"
    ];

    let lines = code.replace(/\r\n/g, "\n").split("\n");
    let level = 0;
    let formatted = [];

    function fixKeywordCasing(line) {
        let inString = false;
        let inComment = false;
        let words = [];
        let cur = "";

        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (inComment) {
                cur += ch;
                continue;
            }
            if (ch === "'" || (ch === 'R' && line.substring(i, i + 4).toUpperCase() === 'REM ')) {
                if (cur) words.push(cur);
                cur = line.substring(i);
                inComment = true;
                break;
            }
            if (ch === '"') {
                cur += ch;
                inString = !inString;
                continue;
            }
            if (inString) {
                cur += ch;
                continue;
            }
            if (/[a-zA-Z0-9_]/.test(ch)) {
                cur += ch;
            } else {
                if (cur) {
                    words.push(cur);
                    cur = "";
                }
                words.push(ch);
            }
        }
        if (cur) words.push(cur);

        return words.map(w => {
            if (w.startsWith("'") || w.startsWith('"') || w.toUpperCase().startsWith("REM")) return w;
            const kw = keywords.find(k => k.toLowerCase() === w.toLowerCase());
            return kw || w;
        }).join("");
    }

    for (let rawLine of lines) {
        let line = rawLine.trim();
        if (!line) {
            formatted.push("");
            continue;
        }

        line = fixKeywordCasing(line);

        const isCloser = blockClosers.test(line);
        const isMid = blockMid.test(line);
        const isMultiLineIf = /^If\b.*?\bThen$/i.test(line);
        const isOpener = (blockOpeners.test(line) && !line.startsWith("End ")) || isMultiLineIf;

        if (isCloser || isMid) {
            level = Math.max(0, level - 1);
        }

        formatted.push(indent.repeat(level) + line);

        if (isOpener || isMid) {
            level++;
        }
    }

    return formatted.join("\n");
}

export function formatCsharp(code, indentSize = 4) {
    if (!code || !code.trim()) return code;
    const indent = " ".repeat(indentSize);

    let clean = code.replace(/\r\n/g, "\n").trim();
    let result = "";
    let level = 0;
    let inString = false;
    let stringChar = "";
    let isVerbatim = false;
    let inLineComment = false;
    let inBlockComment = false;
    let buffer = "";

    for (let i = 0; i < clean.length; i++) {
        const char = clean[i];
        const next = clean[i + 1];

        if (inLineComment) {
            buffer += char;
            if (char === "\n") {
                inLineComment = false;
                result += buffer.trimEnd() + "\n" + indent.repeat(level);
                buffer = "";
            }
            continue;
        }

        if (inBlockComment) {
            buffer += char;
            if (char === "*" && next === "/") {
                buffer += next;
                i++;
                inBlockComment = false;
            }
            continue;
        }

        if (inString) {
            buffer += char;
            if (isVerbatim) {
                if (char === '"' && next === '"') {
                    buffer += next;
                    i++;
                } else if (char === '"') {
                    inString = false;
                    isVerbatim = false;
                }
            } else {
                if (char === stringChar && clean[i - 1] !== "\\") {
                    inString = false;
                }
            }
            continue;
        }

        if (char === "/" && next === "/") {
            inLineComment = true;
            buffer += "//";
            i++;
            continue;
        }

        if (char === "/" && next === "*") {
            inBlockComment = true;
            buffer += "/*";
            i++;
            continue;
        }

        if (char === "@" && next === '"') {
            inString = true;
            isVerbatim = true;
            stringChar = '"';
            buffer += '@"';
            i++;
            continue;
        }

        if (char === '"' || char === "'") {
            inString = true;
            stringChar = char;
            buffer += char;
            continue;
        }

        if (char === "{") {
            const trimmed = buffer.trim();
            buffer = "";
            if (trimmed) {
                result += (result && !result.endsWith("\n") ? "\n" : "") + indent.repeat(level) + trimmed + "\n";
            }
            result += indent.repeat(level) + "{\n";
            level++;
            result += indent.repeat(level);
        } else if (char === "}") {
            const trimmed = buffer.trim();
            buffer = "";
            if (trimmed) {
                result += (result && !result.endsWith("\n") ? "\n" : "") + indent.repeat(level) + trimmed + "\n";
            }
            level = Math.max(0, level - 1);
            result += (result && !result.endsWith("\n") ? "\n" : "") + indent.repeat(level) + "}\n";
            result += indent.repeat(level);
        } else if (char === ";") {
            buffer += char;
            result += buffer.trim() + "\n" + indent.repeat(level);
            buffer = "";
        } else if (char === "\n") {
            if (buffer.trim()) buffer += " ";
        } else {
            buffer += char;
        }
    }

    if (buffer.trim()) {
        result += buffer.trim();
    }

    return result.replace(/\n\s*\n\s*\n+/g, "\n\n").trim();
}

export function formatSql(sql, indentSize = 2) {
    if (!sql || !sql.trim()) return sql;
    const indent = " ".repeat(indentSize);

    const majorKeywords = [
        "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING",
        "LIMIT", "OFFSET", "INSERT INTO", "VALUES", "UPDATE", "SET",
        "DELETE FROM", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN",
        "CROSS JOIN", "JOIN", "UNION ALL", "UNION"
    ];

    const keywords = [
        "SELECT", "FROM", "WHERE", "AND", "OR", "IN", "NOT IN", "EXISTS", "NOT EXISTS",
        "IS NULL", "IS NOT NULL", "LIKE", "ILIKE", "BETWEEN", "AS", "DISTINCT", "TOP",
        "JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN", "ON",
        "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "ASC", "DESC",
        "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE", "DELETE FROM",
        "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "CREATE VIEW", "DROP VIEW",
        "UNION", "UNION ALL", "CASE", "WHEN", "THEN", "ELSE", "END",
        "COUNT", "SUM", "AVG", "MIN", "MAX", "COALESCE", "CAST", "CONVERT"
    ];

    let clean = sql.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();

    keywords.sort((a, b) => b.length - a.length);
    for (const kw of keywords) {
        const regex = new RegExp(`(?<=^|\\s|[(),;])${kw.replace(" ", "\\s+")}(?=$|\\s|[(),;])`, "gi");
        clean = clean.replace(regex, kw);
    }

    let result = "";
    let level = 0;
    const tokens = clean.split(/(\b(?:SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|INSERT INTO|VALUES|UPDATE|SET|DELETE FROM|LEFT JOIN|RIGHT JOIN|INNER JOIN|FULL JOIN|CROSS JOIN|JOIN|UNION ALL|UNION)\b|[(),])/gi);

    for (let t of tokens) {
        if (!t || !t.trim()) continue;
        const upper = t.trim().toUpperCase();

        if (majorKeywords.includes(upper)) {
            result += (result ? "\n" : "") + indent.repeat(level) + upper + " ";
        } else if (upper === "(") {
            result += " (\n";
            level++;
            result += indent.repeat(level);
        } else if (upper === ")") {
            level = Math.max(0, level - 1);
            result += "\n" + indent.repeat(level) + ")";
        } else if (upper === ",") {
            result = result.trimEnd() + ",\n" + indent.repeat(level + 1);
        } else {
            let clauseText = t.trim();
            clauseText = clauseText.replace(/\b(AND|OR)\b/g, "\n" + indent.repeat(level + 1) + "$1");
            result += clauseText + " ";
        }
    }

    return result.replace(/[ \t]+\n/g, "\n").replace(/\n\s*\n+/g, "\n").trim();
}
//#endregion

//#region SYNTAX HIGHLIGHTER
function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function highlightCode(code, lang) {
    if (!code) return "";
    const l = (lang || "").toLowerCase().trim();

    let output = "";
    if (l === "json") output = highlightJson(code);
    else if (l === "html" || l === "xml") output = highlightHtml(code);
    else if (l === "css") output = highlightCss(code);
    else if (l === "javascript" || l === "js") output = highlightJs(code);
    else if (l === "vb" || l === "vbnet" || l === "vb.net" || l === "visualbasic") output = highlightVb(code);
    else if (l === "c#" || l === "csharp" || l === "cs") output = highlightCsharp(code);
    else if (l === "sql") output = highlightSql(code);
    else output = escapeHtml(code);

    if (code.endsWith("\n")) {
        output += " ";
    }
    return output;
}

function highlightJson(code) {
    const tokenRegex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}\[\]:,])/g;
    let result = "";
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(code)) !== null) {
        if (match.index > lastIndex) {
            result += escapeHtml(code.substring(lastIndex, match.index));
        }
        const token = match[0];
        if (token.startsWith('"')) {
            if (token.endsWith(":")) {
                const key = token.slice(0, -1);
                result += `<span class="token key">${escapeHtml(key)}</span>:`;
            } else {
                result += `<span class="token string">${escapeHtml(token)}</span>`;
            }
        } else if (/^(true|false)$/.test(token)) {
            result += `<span class="token boolean">${escapeHtml(token)}</span>`;
        } else if (token === "null") {
            result += `<span class="token null">${escapeHtml(token)}</span>`;
        } else if (!isNaN(Number(token))) {
            result += `<span class="token number">${escapeHtml(token)}</span>`;
        } else {
            result += `<span class="token punct">${escapeHtml(token)}</span>`;
        }
        lastIndex = tokenRegex.lastIndex;
    }
    if (lastIndex < code.length) {
        result += escapeHtml(code.substring(lastIndex));
    }
    return result;
}

function highlightHtml(code) {
    const tokenRegex = /(<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[a-zA-Z0-9:-]+|\/?>|(\s+)([a-zA-Z0-9:-]+)(=)(".*?"|'.*?'|[^\s>]+)?|[^<]+)/gi;
    let result = "";
    let match;

    while ((match = tokenRegex.exec(code)) !== null) {
        const token = match[0];
        if (token.startsWith("<!--")) {
            result += `<span class="token comment">${escapeHtml(token)}</span>`;
        } else if (token.toUpperCase().startsWith("<!DOCTYPE")) {
            result += `<span class="token doctype">${escapeHtml(token)}</span>`;
        } else if (token.startsWith("</")) {
            const tagName = token.substring(2);
            result += `&lt;/<span class="token tag">${escapeHtml(tagName)}</span>`;
        } else if (token.startsWith("<")) {
            const tagName = token.substring(1);
            result += `&lt;<span class="token tag">${escapeHtml(tagName)}</span>`;
        } else if (token === ">" || token === "/>") {
            result += `&gt;`;
        } else if (match[3]) {
            result += match[2] + `<span class="token attr-name">${escapeHtml(match[3])}</span>`;
            if (match[4]) {
                result += `<span class="token punct">=</span>`;
                if (match[5]) {
                    result += `<span class="token attr-val">${escapeHtml(match[5])}</span>`;
                }
            }
        } else {
            result += escapeHtml(token);
        }
    }
    return result;
}

function highlightCss(code) {
    const tokenRegex = /(\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms|deg|pt|fr)?\b|!important\b|[{};:,]|[a-zA-Z-][a-zA-Z0-9-]*(?=\s*:)|[^{};:]+)/g;
    let result = "";
    let match;

    while ((match = tokenRegex.exec(code)) !== null) {
        const token = match[0];
        if (token.startsWith("/*")) {
            result += `<span class="token comment">${escapeHtml(token)}</span>`;
        } else if (token.startsWith('"') || token.startsWith("'")) {
            result += `<span class="token string">${escapeHtml(token)}</span>`;
        } else if (token.startsWith("#") && token.length <= 9) {
            result += `<span class="token number">${escapeHtml(token)}</span>`;
        } else if (token === "!important") {
            result += `<span class="token keyword">${escapeHtml(token)}</span>`;
        } else if (/^\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms|deg|pt|fr)?$/.test(token)) {
            result += `<span class="token number">${escapeHtml(token)}</span>`;
        } else if (/^[{};:,]$/.test(token)) {
            result += `<span class="token punct">${escapeHtml(token)}</span>`;
        } else if (/^[a-zA-Z-][a-zA-Z0-9-]*$/.test(token)) {
            result += `<span class="token property">${escapeHtml(token)}</span>`;
        } else {
            result += escapeHtml(token);
        }
    }
    return result;
}

function highlightGeneric(code, keywords, types, commentPatterns, stringPatterns, funcs = true, caseInsensitive = false) {
    const flags = caseInsensitive ? "gi" : "g";
    const kwSet = new Set(keywords.map(k => caseInsensitive ? k.toLowerCase() : k));
    const typeSet = new Set((types || []).map(t => caseInsensitive ? t.toLowerCase() : t));

    const pattern = new RegExp(
        [
            ...commentPatterns,
            ...stringPatterns,
            `\\b\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?[a-zA-Z]*\\b`,
            `\\b[a-zA-Z_][a-zA-Z0-9_]*\\b`,
            `[{}()\\[\\]/,.;:=+\\-*<>!&|~^%?]`
        ].join("|"),
        flags
    );

    let result = "";
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(code)) !== null) {
        if (match.index > lastIndex) {
            result += escapeHtml(code.substring(lastIndex, match.index));
        }
        const token = match[0];
        const check = caseInsensitive ? token.toLowerCase() : token;

        if (token.startsWith("//") || token.startsWith("/*") || token.startsWith("--") || token.startsWith("'") || token.toUpperCase().startsWith("REM")) {
            result += `<span class="token comment">${escapeHtml(token)}</span>`;
        } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`") || token.startsWith('@"') || token.startsWith('$"')) {
            result += `<span class="token string">${escapeHtml(token)}</span>`;
        } else if (kwSet.has(check)) {
            result += `<span class="token keyword">${escapeHtml(token)}</span>`;
        } else if (typeSet.has(check)) {
            result += `<span class="token type">${escapeHtml(token)}</span>`;
        } else if (!isNaN(Number(token)) || /^\d/.test(token)) {
            result += `<span class="token number">${escapeHtml(token)}</span>`;
        } else if (funcs && code.substring(pattern.lastIndex).match(/^\s*\(/)) {
            result += `<span class="token function">${escapeHtml(token)}</span>`;
        } else if (/^[{}()[\]/,.;:=+\-*<>!&|~^%?]$/.test(token)) {
            result += `<span class="token punct">${escapeHtml(token)}</span>`;
        } else {
            result += escapeHtml(token);
        }
        lastIndex = pattern.lastIndex;
    }
    if (lastIndex < code.length) {
        result += escapeHtml(code.substring(lastIndex));
    }
    return result;
}

function highlightJs(code) {
    const keywords = [
        "async", "await", "break", "case", "catch", "class", "const", "continue",
        "debugger", "default", "delete", "do", "else", "export", "extends", "finally",
        "for", "function", "get", "if", "import", "in", "instanceof", "let", "new",
        "null", "of", "return", "set", "static", "super", "switch", "this", "throw",
        "try", "typeof", "undefined", "var", "void", "while", "with", "yield", "true", "false"
    ];
    return highlightGeneric(
        code,
        keywords,
        ["Array", "Object", "String", "Number", "Boolean", "Date", "Promise", "Map", "Set", "JSON", "Math"],
        ["\\/\\/[^\\n]*", "\\/\\*[\\s\\S]*?\\*\\/"],
        ['"(?:\\\\.|[^"\\\\])*"', "'(?:\\\\.|[^'\\\\])*'", '`(?:\\\\.|[^`\\\\])*`'],
        true,
        false
    );
}

function highlightCsharp(code) {
    const keywords = [
        "abstract", "as", "base", "break", "case", "catch", "checked", "class", "const",
        "continue", "default", "delegate", "do", "else", "enum", "event", "explicit",
        "extern", "false", "finally", "fixed", "for", "foreach", "goto", "if", "implicit",
        "in", "interface", "internal", "is", "lock", "namespace", "new", "null", "operator",
        "out", "override", "params", "private", "protected", "public", "readonly", "ref",
        "return", "sealed", "sizeof", "stackalloc", "static", "struct", "switch", "this",
        "throw", "true", "try", "typeof", "unchecked", "unsafe", "using", "virtual",
        "volatile", "while", "async", "await", "record", "init", "yield", "get", "set"
    ];
    const types = [
        "bool", "byte", "sbyte", "char", "decimal", "double", "float", "int", "uint",
        "nint", "nuint", "long", "ulong", "short", "ushort", "object", "string", "void",
        "dynamic", "var", "List", "Dictionary", "Task", "Action", "Func", "Console"
    ];
    return highlightGeneric(
        code,
        keywords,
        types,
        ["\\/\\/[^\\n]*", "\\/\\*[\\s\\S]*?\\*\\/"],
        ['@"(?:""|[^"])*"', '\\$"(?:\\\\.|[^"\\\\])*"', '"(?:\\\\.|[^"\\\\])*"', "'(?:\\\\.|[^'\\\\])*'"],
        true,
        false
    );
}

function highlightVb(code) {
    const keywords = [
        "AddHandler", "AddressOf", "Alias", "And", "AndAlso", "As", "ByRef", "ByVal",
        "Call", "Case", "Catch", "CBool", "CByte", "CChar", "CDate", "CDbl", "CDec",
        "CInt", "Class", "CLng", "CObj", "Const", "Continue", "CSByte", "CShort", "CSng",
        "CStr", "CType", "CUInt", "CULng", "CUShort", "Declare", "Default", "Delegate",
        "Dim", "DirectCast", "Do", "Each", "Else", "ElseIf", "End", "EndIf", "Enum",
        "Erase", "Error", "Event", "Exit", "False", "Finally", "For", "Friend", "Function",
        "Get", "GetType", "GetXMLNamespace", "Global", "GoSub", "GoTo", "Handles", "If",
        "Implements", "Imports", "In", "Inherits", "Interface", "Is", "IsNot", "Let",
        "Lib", "Like", "Loop", "Me", "Mod", "Module", "MustInherit", "MustOverride",
        "MyBase", "MyClass", "Namespace", "Narrowing", "New", "Next", "Not", "Nothing",
        "NotInheritable", "NotOverridable", "Of", "On", "Operator", "Option", "Optional",
        "Or", "OrElse", "Out", "Overloads", "Overridable", "Overrides", "ParamArray",
        "Partial", "Private", "Property", "Protected", "Public", "RaiseEvent", "ReadOnly",
        "ReDim", "RemoveHandler", "Resume", "Return", "Select", "Set", "Shadows", "Shared",
        "Static", "Step", "Stop", "Structure", "Sub", "SyncLock", "Then", "Throw", "To",
        "True", "Try", "TryCast", "TypeOf", "Using", "Variant", "Wend", "When", "While",
        "Widening", "With", "WithEvents", "WriteOnly", "Xor"
    ];
    const types = [
        "Boolean", "Byte", "Char", "Date", "Decimal", "Double", "Integer", "Long",
        "Object", "SByte", "Short", "Single", "String", "UInteger", "ULong", "UShort"
    ];
    return highlightGeneric(
        code,
        keywords,
        types,
        ["'[^\\n]*", "\\bREM\\b[^\\n]*"],
        ['"(?:""|[^"\\n])*"'],
        true,
        true
    );
}

function highlightSql(code) {
    const keywords = [
        "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET",
        "DELETE", "CREATE", "ALTER", "DROP", "TABLE", "VIEW", "INDEX", "JOIN",
        "INNER", "LEFT", "RIGHT", "FULL", "OUTER", "CROSS", "ON", "GROUP", "BY",
        "ORDER", "HAVING", "LIMIT", "OFFSET", "TOP", "UNION", "ALL", "DISTINCT",
        "AS", "AND", "OR", "NOT", "IN", "IS", "NULL", "LIKE", "ILIKE", "BETWEEN",
        "EXISTS", "CASE", "WHEN", "THEN", "ELSE", "END", "EXEC", "EXECUTE",
        "BEGIN", "TRANSACTION", "COMMIT", "ROLLBACK", "DECLARE", "IF", "DATABASE",
        "SCHEMA", "USE", "WITH", "OVER", "PARTITION", "PRIMARY", "KEY", "FOREIGN",
        "REFERENCES", "CONSTRAINT", "DEFAULT", "CHECK", "UNIQUE", "AUTO_INCREMENT",
        "IDENTITY", "ASC", "DESC"
    ];
    const funcs = [
        "COUNT", "SUM", "AVG", "MIN", "MAX", "COALESCE", "NULLIF", "CONCAT",
        "SUBSTRING", "TRIM", "UPPER", "LOWER", "DATEADD", "DATEDIFF", "GETDATE",
        "NOW", "ROW_NUMBER", "RANK", "DENSE_RANK", "CAST", "CONVERT"
    ];
    return highlightGeneric(
        code,
        keywords,
        funcs,
        ["--[^\\n]*", "\\/\\*[\\s\\S]*?\\*\\/"],
        ["'(?:\\\\.|[^'\\\\])*'", '"(?:\\\\.|[^"\\\\])*"'],
        false,
        true
    );
}
//#endregion

