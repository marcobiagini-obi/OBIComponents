import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "app-header",
    template: `<div app-header>
            <div company-logo @click='location.replace($.link)'></div>
            <div app-title @click='location.replace($.link)'>{{titolo}}</div>
        </div>`,
    options: {
        inputs: ["titolo", "link"],
    }
});