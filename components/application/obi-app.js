import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";
import "./obi-splashscreen.js";

defineComponent({
    selector: "obi-app",
    template: `<div obi-app>
        <app-header :titolo='titolo' :clean='isClean' :fixed='isFixed' :link='home'>
            <slot name='user'></slot>
            <slot name='tools'></slot>
        </app-header>
        <slot name="navigation"></slot>
        <slot name="content"></slot>
        <obi-splashscreen :titolo='titolo' state='loading'></obi-splashscreen>
    </div>`,
    options: {
        inputs: ["titolo", "home"],
        computed: {
            isFixed: function () { return this.__element.hasAttribute("fixed"); },
            isClean: function () { return this.__element.hasAttribute("clean"); },
        },
        actions: {
            removeSplashScreen: function () {
                setTimeout(() => {
                    const splash = document.querySelector("[obi-splashscreen][state='loading']");
                    if (splash) {
                        splash.setAttribute("state", "loaded");
                    }
                }, 1000);
            },
        },
        events: [
            {
                name: "render",
                action: function () { if (this && "removeSplashScreen" in this) this.removeSplashScreen(); }
            }
        ],
    },
});

defineComponent({
    selector: "obi-app-component",
    template: `<test-template name='OBI APP' description='' :code='template' just-code>
    <section actions slot='actions'>
        <obi-checkbox :valore='collapsed' label='Collapsed' button></obi-checkbox>
    </section>
</test-template>`,
    options: {
        dataset: {
            template:
                `<obi-app id='myApp' titolo='Titolo Progetto'> /** aggiungere gli attributi clean='' e fixed='' per personalizzare l'header*/
    <div app-tools slot='tools'></div> /**Aggiunge item al'header -> vedere il componente app-header in interfaccia*/
    <obi-nav slot='navigation'></obi-nav> /**Aggiunge la navigazione -> vedere il componente obi-nav in navigazione*/
    <app-content></app-content> /**Contenitore del corpo dell'applicazione */
</obi-app>
                `,
        }
    }
})