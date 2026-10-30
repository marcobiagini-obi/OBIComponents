import { asyncDataLoader } from "../../core.js";
import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "chat-details",
    template: `
        <div chat-details>
            <obi-card>
                <obi-textarea :valore='info.note' label='Descrizione' @changed='triggerUpdateChat'></obi-textarea>
            </obi-card>
            <obi-tab>
                <tab-item icona='groups' titolo='Partecipanti' :current='$.view=="members"' @click='navigate' value='members'></tab-item>
                <tab-item icona='description' titolo='Documenti' :current='$.view=="docs"' @click='navigate' value='docs'></tab-item>
                <tab-item icona='link' titolo='Links' :current='$.view=="links"' @click='navigate' value='links'></tab-item>
                <tab-item cmd-for='tab in tabs' :icona='tab.icona' :titolo='tab.label' :current='$.view==$.tab.value' :value='tab.value' @click='navigate'></tab-item>
            </obi-tab>
            <section cmd-if='$.view=="members"' name='members' display-column>
                <div cmd-for='group in listMembers' flex-size='auto'>
                    <obi-headline :label='group.ruolo'></obi-headline>
                    <obi-list x2 gap='xs' display-column>
                        <list-item relevance='secondary' rounded cmd-for='user in group.users' :testo='user.username' :descrizione='user.email' :prepend='$.getMemberLogo($.user)'></list-item>
                    </obi-list>
                </div>
            </section>
            <section cmd-elseif='$.view=="docs"' name='documents' display-grid gap='xs'>
                <obi-filecard relevance='neutral' cmd-for='doc in listDocs' grid-size='3' :file='doc' style='margin:0'></obi-filecard>
            </section>
            <section cmd-elseif='$.view=="links"' name='links' margin-topdown='sm'>
                <obi-list x2>
                    <list-item cmd-for='item in listLiks' prepend='<obi-icon nome="open_in_new"></obi-icon>' relevance='tertiary' style='align-items: center' gap='sm'>
                        <obi-title title='Apri il link' :titolo='item.link' :descrizione='item.user' @click='$.openLink($.item.link)' size='sm' interactable></obi-title>
                        <obi-button @click='$.goToMessageTrigger($.item.id)'><obi-icon nome='message'></obi-icon></obi-button>
                    </list-item>
                </obi-list>
            </section>
        </div>
    `,
    options: {
        inputs: ["info", "tabs"],
        dataset: {
            view: "members",
            listMembers: [],
            listDocs: [],
            listLiks: [],
            tabs: [],
        },
        storage: {
            _updateChatTimer: null,
        },
        actions: {
            navigate(evt) {
                let selectedView = evt.currentTarget.getAttribute("value");
                if (this.view === selectedView) return;
                this.view = selectedView;
                this.__node.trigger("details", selectedView);
            },
            getMembers() {
                if (!this.info || !Array.isArray(this.info.members)) return [];
                const groupsMap = this.info.members.reduce((groups, user) => {
                    const ruolo = user.ruolo || "Altro";
                    if (!groups[ruolo]) groups[ruolo] = [];
                    groups[ruolo].push(user);
                    return groups;
                }, {});
                this.listMembers = Object.entries(groupsMap).map(([ruolo, users]) => ({ ruolo, users }));
            },
            getMemberLogo(user) {
                return user.profilo ? `<obi-logo src="${user.profilo}"></obi-logo>` : '<obi-icon nome="account_circle"></obi-icon>';
            },
            getDocumenti() {
                if (!this.info || !Array.isArray(this.info.messages)) return [];
                this.listDocs = this.info.messages
                    .filter(msg => msg.attachments.length > 0)
                    .map(msg => msg.attachments[0]);
            },
            getLinks() {
                if (!this.info || !Array.isArray(this.info.messages)) return [];
                const urlRegex = /https?:\/\/[^\s"'<>]+/g;
                let links = [];
                this.info.messages.forEach(msg => {
                    if (msg.note && typeof msg.note === "string") {
                        const found = msg.note.match(urlRegex);
                        if (found) Array.from(new Set(found.filter(l => !l.match(/<\/?[a-z][\s\S]*>/i)))).forEach((link) => { links.push({ id: msg.id, user: msg.nome, link: link }); });
                    }
                });
                // Remove duplicates
                this.listLiks = links;
            },
            goToMessageTrigger(id) {
                this.__node.trigger("navigate", id);
            },
            openLink(link) {
                window.open(link, "_blank", "noopener,noreferrer");
            },
            formatLink(item) {
                return `<span font-type="caption" style='font-size: .8em'>${item.user}</span>\n${item.link}`;
            },
            triggerUpdateChat(evt) {
                if (this.__storage._updateChatTimer) clearTimeout(this.__storage._updateChatTimer);
                this.__storage._updateChatTimer = setTimeout(() => {
                    this.__node.trigger("updatechat", evt);
                    this.__storage._updateChatTimer = null;
                }, 2000);
                return; // Prevent immediate trigger below
            }
        },
        events: [
            asyncDataLoader.call(this, async function () {
                this.getMembers();
                this.getDocumenti();
                this.getLinks();
            }),
        ]
    }
});