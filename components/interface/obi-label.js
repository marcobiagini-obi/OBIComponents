import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "obi-label",
    template:
        `<div obi-label>
            <div label>
                <obi-icon cmd-if='$.icona != null' :nome='icona'></obi-icon>
                <strong cmd-if='$.label != null'>{{label}}</strong>
            </div>
            <span cmd-if='$.valore != null'>{{valore}}</span>
        </div>`,
    options: {
        inputs: ["label", "valore", "icona"],
    }
});