import { setupComponent } from "../../LAMP/RenderModule/modules/templates.js";
import { Support } from "../../LAMP/RenderModule/modules/library.js";

setupComponent(
    "table-row",
    `<tr :data-value='value'>
        <td cmd-for='valore in celle' cmd-model='valore'></td>
     </tr>`,
    {
        inputs: ["valore", "celle", "chiave"],
        computed: {
            value: function () {
                return Support.getValue(this.valore, this.chiave);
            }
        }

    }
);