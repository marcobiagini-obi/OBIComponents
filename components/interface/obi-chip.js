import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "obi-chip",
    template:
        `<div obi-chip>
            <span name='prepend' cmd-if='$.prepend != ""' class='material-symbols-outlined'>{{prepend}}</span>
            {{label}}
            <span name='append' cmd-if='$.append != ""' class='material-symbols-outlined'>{{append}}</span>
        </div>`,
    options: {
        inputs: ["label", "prepend", "append"],
        dataset: {
            prepend: "",
            append: "",
            label: "",
        }
    }
});