import { setupComponent } from "../../LAMP/RenderModule/modules/templates.js";

setupComponent(
    "table-header",
    `<th>
        <span prepend cmd-if='$.ordine == \"asc\"' class='material-symbols-outline'>arrow_drop_up</span>
        <span prepend cmd-if='$.ordine == \"desc\"' class='material-symbols-outline'>arrow_drop_down</span>
        {{titolo}}
    </th>`,
    {
        inputs: ["titolo", "ordine"]
    }
);