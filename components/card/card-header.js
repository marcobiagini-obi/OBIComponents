import { setupComponent } from "../../LAMP/RenderModule/modules/templates.js";

setupComponent(
    "card-header",
    `<section card-header>
        <span cmd-if='$.icon != null' prepend class='material-symbols-outlined'>{{icon}}</span>
        <div cmd-if='$.prepend != null' prepend>{{prepend}}</div>
        <obi-title cmd-if='$.titolo || $.sottotitolo' :titolo='titolo' :descrizione='sottotitolo'></obi-title>
        <div cmd-if='$.append != null' append>{{append}}</div>
    </section>`,
    {
        inputs: ["titolo", "sottotitolo", "prepend", "append", "icon"]
    }
);