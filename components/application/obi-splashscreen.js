import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";

defineComponent({
    selector: "obi-splashscreen",
    template: `<div obi-splashscreen>
    <div display-row style='align-items:stretch;'>
        <div company-logo></div>
        <div cmd-if='titolo' app-title>{{titolo}}</div>
    </div>
    <div splash-animation-container>
        <svg class="logo" width="500" height="160" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
            <path class="logo-part delay-0" d="M19 16L24 8L19 0H10L15 8L10 16H19Z" fill="#FF7E21"/>
            <path class="logo-part delay-1" d="M13 8L8 0H5L10 8L5 16H8L13 8Z" fill="#FF7E21"/>
            <path class="logo-part delay-2" d="M0 0H3L8 8L3 16H0L5 8L0 0Z" fill="#FF7E21"/>
        </svg>
    </div>
    </div>`,
    options: {
        inputs: ["titolo"],
    }
});