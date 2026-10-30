import { asyncDataLoader } from "../../core.js";
import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "chat-media-links",
    template: `<chat-details-section name='links' @visible='getLinks'>
            <obi-list x2>
                <list-item cmd-for='item in list' prepend='<obi-icon nome="open_in_new"></obi-icon>' relevance='tertiary' style='align-items: center' gap='sm'>
                    <obi-title title='Apri il link' :titolo='item.link' :descrizione='item.user' @click='openLink' size='sm' interactable :src='item.link'></obi-title>
                    <obi-button @click='$.goToMessageTrigger($.item.id)'><obi-icon nome='message'></obi-icon></obi-button>
                </list-item>
            </obi-list>
    </chat-details-section>`,
    options: {
        inputs: ["chat"],
        dataset: {
            list: [],
        },
        storage: {},
        computed: {},
        actions: {
            getLinks() {
                if (!this.chat || !Array.isArray(this.chat.messages)) return [];
                const urlRegex = /https?:\/\/[^\s"'<>]+/g;
                let links = [];
                this.chat.messages.forEach(msg => {
                    if (msg.note && typeof msg.note === "string") {
                        const found = msg.note.match(urlRegex);
                        if (found) Array.from(new Set(found.filter(l => !l.match(/<\/?[a-z][\s\S]*>/i)))).forEach((link) => { links.push({ id: msg.id, user: msg.nome, link: link }); });
                    }
                });
                // Remove duplicates
                this.list = links;
            },
            goToMessageTrigger(id) {
                this.__node.trigger("find", id);
            },
            openLink(evt) {
                let target = evt.currentTarget;
                let link = target.getAttribute("src");
                if (link) window.open(link, "_blank", "noopener,noreferrer");
            },
            formatLink(item) {
                return `<span font-type="caption" style='font-size: .8em'>${item.user}</span>\n${item.link}`;
            },
        },
        events: [
            asyncDataLoader.call(this, async function () { this.getLinks(); }),
        ]
    }
});