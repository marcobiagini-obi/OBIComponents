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
