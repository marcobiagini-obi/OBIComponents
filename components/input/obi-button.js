import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { clickRippleEvent } from "../../src/support.js";

defineComponent({
    selector: "obi-button",
    template:
        `<button obi-button>
            <span cmd-if='$.prepend' prepend class='material-symbols-outlined'>{{prepend}}</span>
            <div cmd-if='$.label' class='txt-button'>{{label}}</div>
            <span cmd-if='$.append' append class='material-symbols-outlined'>{{append}}</span>
        </button>`,
    options: {
        inputs: ["label", "prepend", "append"],
        events: [clickRippleEvent]
    }
});

defineComponent({
    selector: "obi-button-component",
    template:
        `<test-template name='OBI BUTTON' description='' :code='code'>
            <section actions slot='actions'>
                <obi-select :valore='type' label='Tipo' :opzioni='types'></obi-select>
                <obi-select cmd-if='$.type != "link"' :valore='variant' label='Varianti' :opzioni='variants'></obi-select>
                <obi-select cmd-if='$.type != "link" && $.variant != "filled"' :valore='relevance' label='Colori' :opzioni='colors'></obi-select>
                <obi-checkbox cmd-if='$.type != "link" && $.type != "icon"' label='Prepend' :valore='prepend' button></obi-checkbox>
                <obi-checkbox cmd-if='$.type != "link" && $.type != "icon"' label='Append' :valore='append' button></obi-checkbox>
            </section>
        </test-template>`,
    options: {
        dataset: {
            prepend: false,
            append: false,
            type: "",
            types: [
                { label: "Default", value: "" },
                { label: "Link", value: "link" },
                { label: "Block", value: "block" },
                { label: "Icon", value: "icon" },
            ],
            variant: false,
            variants: [
                { label: "Standard", value: "" },
                { label: "Filled", value: "filled" },
                { label: "Elevated", value: "elevated" },
                { label: "outlined", value: "outlined" },
            ],
            relevance: "",
            colors: [
                { label: "Nessun colore", value: "" },
                { label: "Primary", value: "primary" },
                { label: "Secondary", value: "secondary" },
                { label: "Tertiary", value: "tertiary" },
                { label: "Success", value: "success" },
                { label: "Warning", value: "warning" },
                { label: "Danger", value: "danger" },
                { label: "Info", value: "info" },
                { label: "Neutral", value: "neutral" },
                { label: "Dark", value: "dark" },
            ],
        },
        computed: {
            code: function () {
                let _prepend = this.prepend ? " prepend='add'" : "";
                let _append = this.append ? " append='add'" : "";
                let _relevance = this.relevance ? " relevance='" + this.relevance + "'" : "";
                let _variant = this.variant ? " variant='" + this.variant + "'" : "";
                let _code = "<obi-button" + _variant + _relevance + _prepend + _append + " label='Button'></obi-button>";
                switch (this.type) {
                    case "icon": _code = "<obi-button" + _variant + _relevance + " icon><obi-icon nome='add'></obi-icon></obi-button>"; break;
                    case "block": _code =
                        `<group-component ` + _variant + `>
    <obi-button` + _relevance + _prepend + _append + ` label='Button 1'></obi-button>
    <obi-button` + _relevance + _prepend + _append + ` label='Button 2'></obi-button>
    <obi-button` + _relevance + _prepend + _append + ` label='Button 3'></obi-button>
</group-component>`;
                        break;
                    case "link": _code = "<obi-button link>Link Esterno</obi-button>"; break;
                }

                return _code;
            },
        },
        actions: {
            toggle: function (field) {
                this[field] = !this[field];
            }
        }
    }
});
