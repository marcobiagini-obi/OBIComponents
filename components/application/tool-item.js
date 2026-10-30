import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "tool-item",
    template: "<obi-button tool-item relevance='brand'icon><obi-icon :nome='icona'></obi-icon></obi-button> ",
    options: {
        inputs: ["icona"],
    }
});