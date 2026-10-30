import { setupComponent } from "../../LAMP/RenderModule/modules/templates.js";

setupComponent(
    "obi-headline",
    `<div obi-headline font-type="caption" cmd-model='label'></div>`,
    {
        inputs: ["label"]
    }
);