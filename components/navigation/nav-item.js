import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { clickRippleEvent } from "../../src/support.js";

defineComponent({
    selector: "nav-item",
    template:
        `<a nav-item :attivo='$.attivo != null && $.attivo' :title='titolo' :href='link'>
            <obi-icon cmd-if='$.icona && !$.logo' :nome='$.icona'></obi-icon>
            <obi-logo cmd-if='logo' :src='$.logo'></obi-logo>
            <div nav-label class='txt-body2'>{{titolo}}</div>
            <obi-badge cmd-if='!(!$.badge || $.badge === 0)' :testo='badge'></obi-badge>
        </a>`,
    options: {
        inputs: ["link", "icona", "logo", "titolo", "badge", "attivo"],
        dataset: {
            attivo: false,
        },
        events: []
    }
});