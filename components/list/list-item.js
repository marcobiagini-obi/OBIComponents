import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";
import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { clickRippleEvent } from "../../src/support.js";

defineComponent({
    selector: "list-item",
    template:
        `<div list-item :title='testo' @click='onSelect' :active='isChecked'>
            <span cmd-if='$.icon' prepend class='material-symbols-outlined'>{{icon}}</span>
            <div prepend cmd-elseif='$.prepend != null'>{{prepend}}</div>
            <obi-title cmd-if='$.testo != null || $.descrizione != null' :titolo='testo' :descrizione='descrizione'></obi-title>
            <div append cmd-if='$.append != null'>{{append}}</div>
            <div append cmd-if='$.isSelectable'><obi-checkbox :valore='selezione' :radio='isRadio'></obi-checkbox></div>
        </div>`,
    options: {
        inputs: ["testo", "descrizione", "prepend", "append", "selezione", "icon"],
        computed: {
            isSelectable: function () { return this.__element.hasAttribute("check"); },
            isRadio: function () { return this.__element.getAttribute("check") == "radio" },
            isChecked: function () {
                return this.isSelectable && this.selezione;
            }
        },
        actions: {
            onSelect() {
                if (this.isSelectable && isBoolean(this.selezione)) {
                    this.selezione = !this.selezione;
                }
            },
        },
        events: [clickRippleEvent,
            {
                name: Collection.node_event.progress,
                action: async function (state) {
                    if (state == Collection.lifecycle.mounted) {
                        if (this.__element?.hasAttribute("check") && !this.__element?.hasAttribute("interactable")) this.__element.addAttribute("interactable");
                    }
                }
            }
        ]
    }
});