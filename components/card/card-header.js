import { setupComponent } from "../../LAMP/RenderModule/modules/templates.js";

setupComponent(
    "card-header",
    `<section card-header>
        <span cmd-if='icon' prepend class='material-symbols-outlined'>{{icon}}</span>
        <div prepend cmd-elseif='$.prepend != null'>{{prepend}}</div>
        <obi-title cmd-if='$.titolo || $.sottotitolo' :titolo='titolo' :descrizione='sottotitolo'></obi-title>
        <div append cmd-if='$.append != null'>{{append}}</div>
    </section>`,
    {
        inputs: ["titolo", "sottotitolo", "prepend", "append", "icon"]
    }
);