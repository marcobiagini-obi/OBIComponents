import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { obiAlert } from "../../core.js";

const symbols_map = {
    log: "",
    success: "done",
    warning: "warning",
    error: "error",
    server_log: "dns",
    server_error: "sync_problem",
    server_success: "done_all",
    debug: "adb"
};

export default class Dialog {
    static #_instance = null;
    static get Instance() {
        if (Dialog.#_instance == null) Dialog.#_instance = new Dialog();
        return Dialog.#_instance;
    }
    constructor() {
        let _alert_area = document.querySelector("div[alert-area]");
        if (!_alert_area) {
            _alert_area = document.createElement("div");
            _alert_area.setAttribute("alert-area", "");
            document.body.appendChild(_alert_area);
        }
        this.area = _alert_area;
    }
    #_display_director = {
        timer: null,
        showed: null,
        coda: [],
        add: (element) => {
            this.#_display_director.coda.push(element);
            if (this.#_display_director.showed == null) this.#_display_director.show();
        },
        show: () => {
            clearTimeout(this.#_display_director.timer);
            if (this.#_display_director.coda.length) {
                this.#_display_director.showed = this.#_display_director.coda.shift();
                this.area.appendChild(this.#_display_director.showed.element);
                if (this.#_display_director.showed.timer) {
                    this.#_display_director.timer = setTimeout(() => {
                        this.#_display_director.remove();
                    }, this.#_display_director.showed.timer);
                }
            }
        },
        remove: () => {
            this.#_display_director.showed.element.setAttribute("closing", "");
            setTimeout(() => {
                this.#_display_director.showed.element.remove();
                this.#_display_director.showed = null;
                this.#_display_director.show();
            }, 300);
        }
    };

    stamp(message, options = { type: "log", actions: [], timer: 3000 }) {
        if (message) {
            this.#_display_director.add({
                element: this.buildMessageElement(message, options.type ? options.type : "log", options.actions),
                timer: options.timer != null ? options.timer : 3000
            });
        }
    }
    buildMessageElement(message, type, actions) {
        let _alert = document.createElement("div");
        _alert.setAttribute("obi-alert", "");
        _alert.setAttribute("type", type);

        let _content_section = document.createElement("div");
        _content_section.setAttribute("content", "");

        //#region TEXT
        let _message = document.createElement("span");
        _message.setAttribute("text", "")
        _message.innerHTML = message;
        _content_section.appendChild(_message);
        //#endregion


        if (type && type in symbols_map && symbols_map[type]) {
            let _icon = document.createElement("span");
            _icon.setAttribute("class", "material-symbols-outlined");
            _icon.setAttribute("icona", "");
            _icon.innerHTML = symbols_map[type];

            _alert.appendChild(_icon);
        }

        //#region ACTIONS
        let _actions_section = document.createElement("div");
        _actions_section.setAttribute("actions", "");
        _content_section.appendChild(_actions_section);


        if (actions && actions.length) {
            for (const act of actions) {
                let _action = document.createElement("button");
                _action.setAttribute("obi-button", "");
                if (act.attributes) {
                    for (const attr of Object.keys(act.attributes)) {
                        _action.setAttribute(attr, Reflect.get(act.attributes, attr));
                    }
                }
                _action.innerHTML = act.name;
                _action.onclick = () => { act.action(); this.#_display_director.remove(); }
                _actions_section.append(_action);
            }
        }

        let _close = document.createElement("button");
        _close.setAttribute("obi-button", "");
        _close.setAttribute("chiudi", "");
        _close.setAttribute("icon", "");
        _close.innerHTML = "<span class='material-symbols-outlined'>close</span>";
        _close.onclick = () => { this.closeOpenedAlert(); }

        _actions_section.appendChild(_close);


        //#endregion

        _alert.appendChild(_content_section);

        return _alert;
    }
    closeOpenedAlert() {
        this.#_display_director.remove();
    }
}

defineComponent({
    selector: 'obi-alert-component',
    template:
        `<test-template name="OBI ALERT" :code="alert_code" :description='note' :data='lorem_ipsum'>
            <section actions slot="actions">
                <obi-button @click="log" relevance="primary">LOG</obi-button>
                <obi-button @click="success" relevance="success">SUCCESS</obi-button>
                <obi-button @click="warning" relevance="warning">WARNING</obi-button>
                <obi-button @click="error" relevance="danger">ERROR</obi-button>
                <obi-button @click="debug" relevance="secondary">DEBUG</obi-button>
            </section>
        </test-template>`,
    options: {
        dataset: {
            note: "",
            lorem_ipsum: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quam massa, imperdiet ut lobortis in, faucibus at felis. Nam in lorem suscipit, placerat ipsum non, finibus leo.",
            alert_template: "obiAlert('messaggio');"
        },
        actions: {
            log: function () {
                this.alert_code = `
obiAlert(data, {
    actions: [
        {
            name: "CONFERMA",
            action: () => { alert("confermato!"); },
            attributes: { relevance: "primary" }
        }
    ],
    timer: 0
});
    `;
                obiAlert(this.lorem_ipsum, {
                    actions: [{ name: "CONFERMA", action: () => { alert("confermato!"); }, attributes: { relevance: "primary", } }], timer: 0
                });
            },
            success: function () {
                this.alert_code = `
obiAlert("Operazione eseguita con successo.", { type: "success" });
    `;
                obiAlert("Operazione eseguita con successo.", { type: "success" });
            },
            warning: function () {
                this.alert_code = `
obiAlert("Attenzione! Compilare tutti i campi correttamente", { type: "warning" });
    `;
                obiAlert("Attenzione! Compilare tutti i campi correttamente", { type: "warning" });
            },
            error: function () {
                this.alert_code = `
obiAlert("Non è stato possibile salvare", { type: "error" });
    `;
                obiAlert("Non è stato possibile salvare", { type: "error" });
            },
            debug: function () {
                this.alert_code = `
obiAlert(lorem_ipsum, { type: "debug", timer: 0 })
    `;
                obiAlert(this.lorem_ipsum, { type: "debug", timer: 0 });
            },
        },
    }

});