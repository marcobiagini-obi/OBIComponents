import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";
/**COMPONENT */
defineComponent({
    selector: "obi-breadcrumbs",
    template:
        `<ul obi-breadcrumbs>
            <li cmd-for='page in path'>
                <a cmd-if='$.page.action != null' @click='$.navigate($.page)'>{{page.label}}</a>
                <span cmd-else>{{page.label}}</span>
            </li>
        </ul>`,
    options: {
        inputs: ["path"],
        dataset: {
            path: [],
        },
        actions: {
            navigate: function (page) {
                if ("action" in page) {
                    page.action(this);
                } else {
                    log("Nessuna azione definita su questo link", { type: Collection.message_type.warning });
                }
            }
        },
    }
});