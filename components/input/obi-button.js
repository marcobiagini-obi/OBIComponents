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
