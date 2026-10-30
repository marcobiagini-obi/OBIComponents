import { asyncDataLoader } from "../../core.js";
import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "chat-media-files",
    template: `<chat-details-section name='docs' display-grid gap='xs' @visible='getDocumenti'>
            <obi-filecard relevance='neutral' cmd-for='item in list' grid-size='3' :file='item.documento' style='margin:0'></obi-filecard>
    </chat-details-section>`,
    options: {
        inputs: ["messaggi"],
        dataset: {
            list: [],
        },
        storage: {},
        computed: {},
        actions: {
            getDocumenti() {
                if (!Array.isArray(this.messaggi)) return [];
                let docs = [];
                this.messaggi.filter(msg => msg.hasAttachments).map(msg => docs.push(...msg.attachments));
                this.list = docs;
            },
        },
        events: [
            asyncDataLoader.call(this, async function () { this.getDocumenti(); }),
        ]
    }
});