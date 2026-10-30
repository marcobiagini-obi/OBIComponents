import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "obi-maintenance",
    template:
        `<div obi-maintenance>
            <img src="http://www.obi.info/images/obi.png" alt="Logo" class="logo">
            <h1 text-color='primary'>We'll Be Back Soon!</h1>
            <p>Our website is currently undergoing maintenance.</p>
            <p>We apologize for the inconvenience and appreciate your patience.</p>
        </div>`,
    options: {
        inputs: [],
        dataset: {},
        computed: {},
        actions: {},
        events: [],
    }
});