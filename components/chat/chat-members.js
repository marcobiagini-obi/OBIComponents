import { asyncDataLoader } from "../../core.js";
import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "chat-members",
    template: `<chat-details-section name='members' display-column gap='sm' @visible='getMembers'>            
        <div cmd-for='group in list' flex-size='auto'>
            <obi-headline :label='group.ruolo'></obi-headline>
            <obi-list x2 gap='xs' display-column>
                <list-item relevance='secondary' rounded cmd-for='user in group.users' :value='user.username'
                :testo='user.username' :descrizione='user.email' :prepend='$.getMemberLogo($.user)' @click='sendMessage' interactable></list-item>
            </obi-list>
        </div>
    </chat-details-section>`,
    options: {
        inputs: ["chat"],
        dataset: {
            list: [],
        },
        storage: {},
        computed: {},
        actions: {
            getMembers() {
                if (!this.chat || !Array.isArray(this.chat.members)) return [];
                const groupsMap = this.chat.members.reduce((groups, user) => {
                    const ruolo = user.ruolo || "Altro";
                    if (!groups[ruolo]) groups[ruolo] = [];
                    groups[ruolo].push(user);
                    return groups;
                }, {});
                this.list = Object.entries(groupsMap)
                    .map(([ruolo, users]) => ({ ruolo, users }))
                    .sort((a, b) => a.ruolo.localeCompare(b.ruolo));
            },
            getMemberLogo(user) {
                return user.profilo ? `<obi-logo src="${user.profilo}"></obi-logo>` : (user.icona ?? '<obi-icon nome="account_circle"></obi-icon>');
            },
            sendMessage(evt) {
                let username = evt.currentTarget.getAttribute("value");
                this.__node.trigger("messageto", username);
            },
        },
        events: [
            asyncDataLoader.call(this, async function () { this.getMembers(); }),
        ]
    }
});