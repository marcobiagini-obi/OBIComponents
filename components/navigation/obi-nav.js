import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import "./nav-item.js";

defineComponent({
    selector: "obi-nav",
    template: `<nav obi-nav app-menu></nav>`
});

defineComponent({
    selector: "obi-nav-component",
    template:
        `<test-template name='OBI NAVIGATION BAR' description='' :code='code' :data='pages'>
            <section actions slot='actions'>
                <obi-checkbox :valore='collapsed' label='Collapsed' button></obi-checkbox>
            </section>
        </test-template>`,
    options: {
        dataset: {
            pages: [
                { page: "Pagina 1", icon: "star", active: true },
                { page: "Pagina 2", icon: "star", active: false },
                { page: "Pagina 3", icon: "star", active: false },
            ],
            collapsed: false,
        },
        computed: {
            code: function () {
                return `<obi-nav` + (this.collapsed ? " collapsed" : "") + `>                                
                            <obi-headline>PAGINE</obi-headline>
                            <nav-item cmd-for='item in data' :titolo="item.page" :icona="item.icon" :attivo="item.active"></nav-item>
                        </obi-nav>`
            }
        }
    }
});