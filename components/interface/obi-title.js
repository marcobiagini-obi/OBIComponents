import { setupComponent } from "../../LAMP/RenderModule/modules/templates.js";

setupComponent(
    "obi-title",
    `<div obi-title>
        <span cmd-if='$.titolo != null' :title='titolo'>{{titolo}}</span>
        <span class='txt-subtitle1 new-line' cmd-if='$.descrizione != null' :title='descrizione'>{{descrizione}}</span>
     </div>`,
    {
        inputs: ["titolo", "descrizione"]
    }
);