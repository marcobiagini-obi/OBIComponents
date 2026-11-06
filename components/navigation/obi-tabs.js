import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { clickRippleEvent } from "../../src/support.js";

defineComponent({
    selector: "obi-tab",
    template: `<div obi-tab></div>`,
});


defineComponent({
    selector: "tab-item",
    template:
        `<a tab-item :attivo='$.attivo' :title='titolo' :href='link' @click='onChangeView' >
            <div container>
                <obi-icon cmd-if='$.icona && !$.logo' :nome='icona'></obi-icon>
                <obi-logo cmd-if='$.logo' :link='logo'></obi-logo>
                <span cmd-model='titolo' class='txt-body2'>{{titolo}}</span>
                <obi-badge cmd-if='!(!$.badge || $.badge === 0)' :testo='badge'></obi-badge>
            </div>
        </a>`,
    options: {
        inputs: ["link", "icona", "logo", "titolo", "badge", "selettore"],
        computed: {
            attivo: function () { return this.__element.hasAttribute("current") || this.selettore ? this.selettore === this.page : false; },
            page: function () { return this.__element.getAttribute("pagina"); }
        },
        actions: {
            onChangeView() {
                let current = this.page;
                if (current) {
                    this.selettore = current;
                    this.__node.trigger("changed", current);
                }
            }
        },
        events: [clickRippleEvent]
    }
});