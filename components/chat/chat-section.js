import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "chat-details-section",
    template: `<section chat-details-section :hidden='isHidden'></section>`,
    options: {
        inputs: ["name"],
        dataset: {},
        storage: {},
        computed: {
            view() {
                let chatContainer = this.__node.getParent("obi-chat");
                if (!chatContainer) return null;
                let context = chatContainer.firstChild?.virtual?.context;
                return context.detailsView ?? null;
            },
            isHidden() { return this.name !== this.view; },
        },
        actions: {
            setup() {
                const targetElement = this.__element;

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (
                            mutation.attributeName === 'style' &&
                            window.getComputedStyle(targetElement).getPropertyValue('display') !== 'none'
                        ) {
                            console.log('Element is now visible!');
                            this.__node.trigger("visible", this.name);
                            // Trigger your custom event or function here
                        }
                    });
                });

                observer.observe(targetElement, { attributes: true });

            },
        },
        events: []
    }
});