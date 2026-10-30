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
/**TEST */
defineComponent({
    selector: "obi-breadcrumbs-component",
    template:
        `<test-template name='OBI BREADCRUMBS NAVIGATION' description='' :code='code' :data='pages'>
        </test-template>`,
    options: {
        dataset: {
            pages: [
                { label: "Home", action: () => { alert("Home") } },
                { label: "Components", action: () => { alert("Components") } },
                { label: "breadcrumbs" },
            ]
        },
        computed: {
            code: function () {
                return "<obi-breadcrumbs :path='data'></obi-breadcrumbs>";
            }
        }
    }
});