import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "obi-badge",
    template: `<span obi-badge cmd-model='label'></span>`,
    options: {
        inputs: ["label"]
    }
});