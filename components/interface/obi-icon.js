import { setupComponent } from "../../LAMP/RenderModule/modules/templates.js";

setupComponent(
    "obi-icon",
    `<div obi-icon>
        <span class="material-symbols-outlined" cmd-model='nome'></span>
    </div>`,
    {
        inputs: ["nome"],
    }
);