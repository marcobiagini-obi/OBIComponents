import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "obi-badge",
    template: `<span obi-badge cmd-model='label'></span>`,
    options: {
        inputs: ["label"]
    }
});


defineComponent({
    selector: "obi-badge-component",
    template:
        `<test-template name='OBI BADGE' description='' :code='code'>
            <section actions slot='actions'>
                <obi-checkbox label='Dot' :valore='dot' button></obi-checkbox>
                <obi-slider :valore='number' min='1' max='999' clean></obi-slider>
            </section>
        </test-template>`,
    options: {
        dataset: {
            dot: false,
            number: 1,
        },
        computed: {
            code: function () {
                let _dot = this.dot ? " dot" : "";
                return "<obi-icon nome='notifications' margin='md'><obi-badge label='" + this.number + "'" + _dot + "></obi-badge></obi-icon>";
            },
        },
    }
});