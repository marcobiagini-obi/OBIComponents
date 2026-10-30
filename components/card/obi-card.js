import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

import "./card-action.js";
import "./card-body.js";
import "./card-header.js";

defineComponent({
    selector: "obi-card",
    template: `<div obi-card>
        <card-header cmd-if='$.titolo || $.descrizione || $.prepend || $.append' :titolo='titolo' :sottotitolo='descrizione' :prepend='prepend' :append='append'></card-header>
        <card-body cmd-if='$.corpo' :corpo='corpo'></card-body>
    </div>`,
    options: {
        inputs: ["titolo", "descrizione", "prepend", "append", "corpo"]
    }
});

defineComponent({
    selector: "obi-card-component",
    template:
        `<test-template name='OBI CARD' description='' :code='code' :data='item'>
            <section actions slot='actions'>
                <obi-select :valore='variant' label='Varianti' :opzioni='variants'></obi-select>
                <obi-select :valore='relevance' label='Colori' :opzioni='colors'></obi-select>
                <obi-checkbox label='Corpo' :valore='body' button></obi-checkbox>
                <obi-checkbox label='Azioni' :valore='action' button></obi-checkbox>
                <obi-checkbox label='Cover' :valore='cover' button></obi-checkbox>
                <obi-checkbox label='Prepend' :valore='prepend' button></obi-checkbox>
                <obi-checkbox label='Append' :valore='append' button></obi-checkbox>
                <obi-checkbox label='Collapse' :valore='collapsible' button></obi-checkbox>
            </section>
        </test-template>`,
    options: {
        dataset: {
            body: false,
            action: false,
            cover: false,
            prepend: false,
            append: false,
            variant: false,
            collapsible: false,
            variants: [
                { label: "Standard", value: "" },
                { label: "Filled", value: "filled" },
                { label: "Elevated", value: "elevated" },
                { label: "outlined", value: "outlined" },
            ],
            relevance: "",
            colors: [
                { label: "Nessun colore", value: "" },
                { label: "primary", value: "primary" },
                { label: "secondary", value: "secondary" },
                { label: "tertiary", value: "tertiary" },
                { label: "success", value: "success" },
                { label: "warning", value: "warning" },
                { label: "danger", value: "danger" },
                { label: "info", value: "info" },
                { label: "neutral", value: "neutral" },
                { label: "dark", value: "dark" },
            ],
            item: {
                lorem_ipsum: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quam massa, imperdiet ut lobortis in, faucibus at felis. Nam in lorem suscipit, placerat ipsum non, finibus leo.",
                collapsed: false,
            }
        },
        computed: {
            code: function () {
                let _body = this.body ? "\n    <card-body :corpo='lorem_ipsum'></card-body>" : "";
                let _action = this.action ? `\n    <card-action>
        <obi-button relevance='secondary' icon><obi-icon nome='star'></obi-icon></obi-button>
        <obi-button relevance='primary'>Primaria</obi-button>        
    </card-action>` : "";
                let _cover = this.cover ? "\n    <obi-cover link='../../resources/images/backgroundOBI.jpg'></obi-cover>" : "";
                let _prepend = this.prepend ? "\n\tprepend='<obi-icon nome=\"alternate_email\"></obi-icon>'" : "";
                let _append = this.append ? "\n\tappend='<obi-icon nome=\"alternate_email\"></obi-icon>'" : "";
                let _variant = this.variant ? " variant='" + this.variant + "'" : "";
                let _relevance = this.relevance ? " relevance='" + this.relevance + "'" : "";

                return `
<obi-card${_relevance}${_variant}${this.collapsible ? " collapse='hide" : ""}>${_cover}
    <card-header titolo='Titolo card' sottotitolo='Sottotitolo della card'${_prepend}${_append}></card-header>${_body}${_action}
</obi-card>`;
            },
        },
    }
});