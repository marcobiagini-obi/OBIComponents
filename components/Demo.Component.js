import { defineComponent } from "../LAMP/RenderModule/LampRender.js";
import { BASE_URL } from "../obi.config.js";

defineComponent({
    selector: "demo-component",
    template: `
        <div test-component display-column flex-size='1'>
            <section header display-row>
                <span class='title'>{{ name }}</span>
                <obi-button icon @click='update'><obi-icon nome='refresh'></obi-icon></obi-button>
            </section>
            <div display-row>
                <section code relevance=\"neutral\" padding='sm' style='height: 80vh; align-items: flex-start;'>
                    <code contenteditable="true" cmd-model='code' style='white-space: pre' @input='autoUpdate'></code>
                </section>
                <section demo style='height: 80vh; width: 50%;'>
                    <iframe></iframe>
                </section>
            </div>
        </div>
    `,
    options: {
        inputs: ["name", "description", "code", "data"],
        dataset: {
            code: `import { defineComponent } from "${BASE_URL}/LAMP/RenderModule/LampRender.js";

defineComponent(
{
    selector: "test-demo",
    template: \`<span font-type='h3'>{{demo}}</span>\`,
    options: {
        inputs: [],
        dataset: {
            demo: "Hello World",
        },
        storage: {},
        computed: {},
        actions: {},
        events: [],
    }
});`,
            refreshTimer: null,
            pendingChanges: true,
        },
        computed: {
            component: function () { return ""; },
        },
        actions: {
            autoUpdate() {
                if (!this.refreshTimer && this.pendingChanges) {
                    this.update();
                    this.pendingChanges = false;
                    this.refreshTimer = setTimeout(() => {
                        this.refreshTimer = null;
                        if (this.pendingChanges) {
                            this.update();
                        }
                    }, 500);
                } else { this.pendingChanges = true; }
            },
            update() {
                try {

                    if (this.__element) {
                        let iframe = this.__element.querySelector("iframe");
                        var html = `${document.head.outerHTML}
    <body>
        <div id='compApp'>
            <test-demo></test-demo>
        </div>
        <script type='module'>
            import RenderEngine from "${BASE_URL}/LAMP/RenderModule/LampRender.js";
            ${this.code}
            RenderEngine.instance.start("compApp").build();
        </scr`+ `ipt>
    </body>`;
                        iframe.contentWindow.document.open();
                        iframe.contentWindow.document.write(html);
                        iframe.contentWindow.document.close();
                        sessionStorage.setItem("compDemo", this.code);
                    }
                } catch (ex) {
                    console.error("Test.Component - " + ex);
                }
            }
        },
        events: [
            {
                name: "progress",
                action: function (state) {
                    if (state == "mounted") {
                        if (sessionStorage.getItem("compDemo") != null) this.code = sessionStorage.getItem("compDemo");
                        this.update();
                    }
                }
            }
        ],
    },
});

defineComponent({
    selector: "demo-app-component",
    template: `
        <div test-component display-column flex-size='1'>
            <section header display-row>
                <span class='title'>{{ name }}</span>
                <obi-button icon @click='update'><obi-icon nome='refresh'></obi-icon></obi-button>
            </section>
            <div display-row>
                <section code relevance=\"neutral\" padding='sm' style='height: 80vh; align-items: flex-start;'>
                    <code contenteditable="true" cmd-model='code' style='white-space: pre' @input='autoUpdate'></code>
                </section>
                <section demo style='height: 80vh; width: 50%;'>
                    <iframe></iframe>
                </section>
            </div>
        </div>
    `,
    options: {
        inputs: ["name", "description", "code", "data"],
        dataset: {
            code: `
<obi-app id='appDemo' :titolo='demo'>
  <app-content slot='content'>
  </app-content>
</obi-app>

<script type='module'>
  import RenderEngine from "${BASE_URL}/LAMP/RenderModule/LampRender.js";
    
  RenderEngine.instance.start("appDemo").build({
    dataset: {
        demo: "Hello World",
    },
    computed: {},
    actions: {},
    events: [],
    settings: {}
  });
</scr`+ `ipt>`,
            refreshTimer: null,
            pendingChanges: true,
        },
        actions: {
            autoUpdate() {
                if (!this.refreshTimer && this.pendingChanges) {
                    this.update();
                    this.pendingChanges = false;
                    this.refreshTimer = setTimeout(() => {
                        this.refreshTimer = null;
                        if (this.pendingChanges) {
                            this.update();
                        }
                    }, 500);
                } else { this.pendingChanges = true; }
            },
            update() {
                try {
                    if (this.__element) {
                        let iframe = this.__element.querySelector("iframe");
                        var html = `${document.head.outerHTML}
                            <body>
                                ${this.code}
                            </body>`;
                        iframe.contentWindow.document.open();
                        iframe.contentWindow.document.write(html);
                        iframe.contentWindow.document.close();
                        sessionStorage.setItem("appDemo", this.code);
                    }
                } catch (ex) {
                    console.error("Test.Component - " + ex);
                }
            }
        },
        computed: {
            formattedScript: function () {


                let regex_tag = /(<[a-z|-]+)|(<\/[a-z|-]+>|\/>)/gm;
                let regex_keyword = /(from\s|import\s|return\s|async\s|await\s|switch\s|case\s|break\;)/gm;
                let regex_type = /(let\s|var\s|const\s|function\(|function\s|this\.|\$\.)/gm;
                let regex_string = /[\"|\'|\`](.*?)[\"|\'|\`]/gm;
                let regex_comment = /(\/\/).*|<!--[^>]*-->/gm;
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

                return this.code.replaceAll(regex_tag, (match) => {
                    if (match.match(/\/>/)) return "<span>/</span><span>></span>";
                    if (match.match(/(<\/[a-z|-]+>)/)) {
                        return style_close_tag.replace("{0}", match.replace("</", "").replace(">", ""));
                    }
                    return style_open_tag.replace("{0}", match.replace("<", ""));
                })
                    .replaceAll(regex_function, (match) => { return style_function.replace("{0}", match.substring(0, match.length - 1)) + match.substring(match.length - 1); })
                    .replaceAll(regex_string, (match) => { return style_string.replace("{0}", match); })
                    .replaceAll(regex_comment, (match) => { return style_comment.replace("{0}", match); })
                    .replaceAll(regex_type, (match) => { return style_type.replace("{0}", match.substring(0, match.length - 1)) + match.substring(match.length - 1); })
                    .replaceAll(regex_keyword, (match) => { return style_keyword.replace("{0}", match.substring(0, match.length - 1)) + match.substring(match.length - 1); })
                    .replaceAll(regex_brackets, (match) => { return style_brackets.replace("{0}", match); })
            },
        },
        events: [
            {
                name: "progress",
                action: function (state) {
                    if (state == "mounted") {
                        if (sessionStorage.getItem("appDemo") != null) this.code = sessionStorage.getItem("appDemo");
                        this.update();
                    }
                }
            }
        ],
    },
});