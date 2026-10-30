import { defineComponent } from "../LAMP/RenderModule/LampRender.js";
import { fallbackCopyToClipboard } from "../src/support.js";


defineComponent({
    selector: "test-template",
    template: `
        <div test-component>
            <section header display-row>
                <div flex-size='auto' display-column>
                    <span class='title' text-color='primary' cmd-model='name'></span>
                    <span cmd-if='$.note != ""' class='subtitle new-line' cmd-model='note'></span>
                </div>
                <obi-button icon relevance='neutral' @click=\"clipCopy\" title=\"Copia il codice\">
                    <span class=\"material-symbols-outlined\">content_copy</span>
                </obi-button>
            </section>
            <section code relevance=\"neutral\">
                <code style='white-space: pre' padding-topdown='sm'>{{formattedScript}}</code>
            </section>
            <section demo>
                <iframe></iframe>
            </section>
            <slot name='actions'></slot>
        </div>
    `,
    options: {
        inputs: ["name", "note", "code", "data"],
        computed: {
            formattedScript: function () {


                let regex_tag = /(<[a-z|-]+)|(<\/[a-z|-]+>|\/>)/gm;
                let regex_keyword = /(from\s|import\s|return\s|async\s|await\s|switch\s|case\s|break\;|get\s|set\s|class\s|extends\s|try|catch)/gm;
                let regex_type = /(let\s|var\s|const\s|function\(|function\s|this\.|\$\.)/gm;
                let regex_string = /\"(.*?)\"|\'(.*?)\'|\`(.*?)\`/gm;
                let regex_comment = /\s(\/\/).*|<!--[^>]*-->/gm;
                let regex_brackets = /\(|\)|\{|\}|\[|\]/gm;
                let regex_function = /([a-zA-Z-\_]+):/gm;

                let style_open_tag = "<span><</span><span tag>{0}</span>";
                let style_close_tag = "<span><</span><span>/</span><span tag>{0}</span><span>></span>";
                let style_comment = "<span comment>{0}</span>";
                let style_keyword = "<span keyword>{0}</span>";
                let style_type = "<span type>{0}</span>";
                let style_brackets = "<span brackets>{0}</span>";
                let style_string = "<span string>{0}</span>";
                let style_function = "<span function>{0}</span>";


                // let rows = this.code.split("\n");
                // let formatted_code = "";
                // for (let row of rows) {
                //     if (row.replace(/\s/g, '').length) {
                //         let words = row.split(" ");
                //         let formatted = "";

                //         for (let word of words) {
                //             formatted += formatWord(word) + " ";
                //         }
                //         formatted_code += `<span row>${formatted}</span>\n`;
                //     } else {
                //         formatted_code += "\n";
                //     }
                // }

                // function formatWord(word) {
                //     if (word.match(regex_tag)) {
                //         if (word.match(/\/>/)) return "<span>/</span><span>></span>";
                //         if (word.match(/(<\/[a-z|-]+>)/)) {
                //             return style_close_tag.replace("{0}", word.replace("</", "").replace(">", ""));
                //         }
                //         return style_open_tag.replace("{0}", word.replace("<", ""));
                //     }
                //     if (word.match(regex_function)) {
                //         var separator = "";
                //         if (word.includes(".")) separator = ".";
                //         if (word.includes("(")) separator = "(";
                //         if (word.includes(":")) separator = ":";
                //         return style_function.replace("{0}", word.replace(separator, "")) + separator;
                //     }
                //     if (word.match(regex_string)) return style_string.replace("{0}", word);
                //     if (word.match(regex_comment)) return style_comment.replace("{0}", word);
                //     if (word.match(regex_brackets)) return style_brackets.replace("{0}", word);
                //     if (word.match(regex_type)) return style_type.replace("{0}", word);
                //     if (word.match(regex_keyword)) return style_keyword.replace("{0}", word);
                // }

                // return formatted_code;

                return this.code.replaceAll(regex_tag, (match) => {
                    if (match.match(/\/>/)) return "<span>/</span><span>></span>";
                    if (match.match(/(<\/[a-z|-]+>)/)) {
                        return style_close_tag.replace("{0}", match.replace("</", "").replace(">", ""));
                    }
                    return style_open_tag.replace("{0}", match.replace("<", ""));
                }).replaceAll(regex_string, (match) => { return style_string.replace("{0}", match); })
                    .replaceAll(regex_function, (match) => { return style_function.replace("{0}", match.substring(0, match.length - 1)) + match.substring(match.length - 1); })
                    .replaceAll(regex_comment, (match) => { return style_comment.replace("{0}", match); })
                    .replaceAll(regex_type, (match) => { return style_type.replace("{0}", match.substring(0, match.length - 1)) + match.substring(match.length - 1); })
                    .replaceAll(regex_keyword, (match) => { return style_keyword.replace("{0}", match.substring(0, match.length - 1)) + match.substring(match.length - 1); })
                    .replaceAll(regex_brackets, (match) => { return style_brackets.replace("{0}", match); })
            },
        },
        actions: {
            clipCopy: function () {
                fallbackCopyToClipboard(this.code);
                alert("testo copiato nella clipboard: " + this.code);
            }
        },
        events: [
            {
                name: "render",
                action: function () {
                    try {
                        if (this.__element && !this.__element.getAttribute("just-code")) {
                            let iframe = this.__element.querySelector("iframe");
                            var html = `${document.head.outerHTML}
                            <body style='display: flex; width: 100%; height: 100%; background: unset; justify-content: center; align-items: flex-start;'>
                                <div id='templateApp'>
                                    ${this.code}
                                </div>
                                <script type='module'>
                                    import RenderEngine from "./LAMP/RenderModule/LampRender.js";

                                    const data = JSON.parse('${JSON.stringify(this.data)}');

                                    RenderEngine.instance.start('templateApp').build({
                                        dataset: data,
                                    });
                                </script>
                            </body>`;
                            iframe.contentWindow.document.open();
                            iframe.contentWindow.document.write(html);
                            iframe.contentWindow.document.close();
                        }
                    } catch (ex) {
                        console.error("Test.Component - " + ex);
                    }
                }
            }
        ],
    },
});