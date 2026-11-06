import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

import "./card-action.js";
import "./card-body.js";
import "./card-header.js";

defineComponent({
    selector: "obi-card",
    template: `<div obi-card>
        <card-header cmd-if='$.titolo || $.descrizione || $.prepend || $.append' :titolo='titolo' :sottotitolo='descrizione' :prepend='prepend' :append='append' :icon='icon'></card-header>
        <card-body cmd-if='$.corpo' :corpo='corpo'></card-body>
    </div>`,
    options: {
        inputs: ["titolo", "descrizione", "prepend", "append", "corpo", "icon"]
    }
});