import UserHandler from "../../LAMP/UserModule/LampAccess.js";
import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import Service from "../../LAMP/ServerModule/LampService.js";
import { handleAPIError, isLocal, loadApi, obiAlert, obiLoader } from "../../core.js";
import { API_URL, BASE_URL } from "../../obi.config.js";

import "./chat-item.js";
import "./chat-members.js";
import "./chat-media-files.js";
import "./chat-media-links.js";
import log from "../../LAMP/RenderModule/modules/console.js";
import Message from "../../src/models/Message.js";
import { enumStatiMessaggio } from "../../src/models/Message.js";
import Chat from "../../src/models/Chat.js";
import { closeFloatingItems, closeOpenedMenus, openFloatingMenu } from "../../LAMP/RenderModule/components/float.component/float.component.js";

const localMessagesKey = "chat_unsent";
const messaggiApiUrl = `${API_URL}/obicomunicazioni/api/messaggi`;
const notificheApiUrl = `${API_URL}/OBIComunicazioni/api/notifiche`;

defineComponent({
    selector: "obi-chat",
    template: `<div obi-chat :view='$.details ? "details" : "chat"' @dragenter='attachToMessage' >
    <div chat-title>
        <obi-icon :nome='$.chat.icon ?? "chat"'></obi-icon>
        <obi-title :titolo='chat.nome' @click='toggleDetails' interactable></obi-title>
        <obi-button cmd-if='details' icon @click='showChat' title='Mostra la Chat'><obi-icon nome='close'></obi-icon></obi-button>
        <obi-button cmd-else  icon @click='showDetails' title='Mostra dettagli' relevance='secondary'><obi-icon nome='chevron_forward'></obi-icon></obi-button>
    </div>
    <div chat-details :hidden='!$.details'>
        <slot name='editor'></slot>
        <obi-tab>
            <tab-item icona='groups' titolo='Partecipanti' :current='$.detailsView=="members"' @click='navigateDetails' value='members'></tab-item>
            <tab-item icona='description' titolo='Documenti' :current='$.detailsView=="docs"' @click='navigateDetails' value='docs'></tab-item>
            <tab-item icona='link' titolo='Links' :current='$.detailsView=="links"' @click='navigateDetails' value='links'></tab-item>
            <tab-item cmd-for='tab in tabs' :icona='tab.icona' :titolo='tab.label' :current='$.detailsView==$.tab.value' :value='tab.value' @click='navigateDetails'></tab-item>
        </obi-tab>
        <chat-members :chat='chat' @messageto='tagMember'></chat-members>
        <chat-media-files :messaggi='viewMessaggi'></chat-media-files>
        <chat-media-links :chat='chat' @find='scrollToMessage'></chat-media-links>
        <slot name='dettagli'></slot>
    </div>
    <div :hidden='details' chat-list @scroll='scrollController' @render='updateScrollPosition' @click='$.viewOptions = ""'></div>
    <div :hidden='details' chat-options display-column gap='sm'>
        <obi-button name='scroller' variant='elevated' @click='scrollToNext'><obi-icon nome='keyboard_double_arrow_down'></obi-icon></obi-button>
        <section options :hidden='$.viewOptions != "options"' display-column gap='sm'>
            <obi-button @click='attachToMessage' size='sm' label='Allega File' prepend='attach_file_add'></obi-button>
            <obi-button @click='openEmailForm' size='sm' label='Invia Email' prepend='attach_email'></obi-button>
        </section>
        <section reply :hidden='!$.isReplying' padding='md'>
            <obi-icon :nome='$.editingMessageId ? "edit" : "reply"'></obi-icon>
            <obi-title size='sm' :titolo='replyToMessage.note' :descrizione='replyToMessage.nome' reverse></obi-title>
            <obi-button variant='filled' @click='closeReplyingMessage' size='sm' icon><obi-icon nome='close' style='z-index:101'></obi-icon></obi-button>
        </section>
        <section attachments :hidden='$.viewOptions != "attachments"'>
            <obi-file name='file_attachment' multiple flex-size='auto' @added='setupAttachedDocs' @removed='setupAttachedDocs'></obi-file>
        </section>
        <section emailForm :hidden='$.viewOptions != "emailform"' display-grid='blog' gap='sm' padding='sm'>
            <obi-title size='sm' margin='md' grid-article titolo='Imposta un invio email'></obi-title>
            <group-component grid-article>
                <obi-chiplist label='Destinatari' :valore='email.receivers' :opzioni='mailinglist' @changed='setupEmailSender' separatore=',' not-select-all></obi-chiplist>
                <obi-button size='sm' label='cc' @click='$.email.copyEnabled = !$.email.copyEnabled'></obi-button>
            </group-component>
            <obi-chiplist :hidden='!$.email.copyEnabled' grid-article label='Copia' :valore='email.copy' :opzioni='mailinglist' @changed='setupEmailSender' separatore=',' not-select-all></obi-chiplist>
            <obi-textbox grid-article label='Soggetto' :valore='email.subject' @changed='setupEmailSender'></obi-textbox>
        </section>
        <section senders :hidden='$.viewOptions != "senders"'>
            <slot name='senders'></slot>
        </section>
    </div>
    <div :hidden='$.details || !$.currentUser' display-row gap='sm' padding='xs'>
        <obi-chip cmd-for='attach in attachmentsList' :relevance='$.attach.color ?? "info"' :label='attach.label' :prepend='attach.icon' style='overflow: visible' variant='outlined'
            interactable @click='$.viewOptions = $.attach.source'>
            <obi-badge :hidden='$.attach.count == 0' :label='attach.count' style='right: 0; left: unset;'></obi-badge>
        </obi-chip>
    </div>
    <group-component :hidden='$.details || !$.currentUser' chat-editor @dragenter='dragFocus'>
        <obi-button cmd-if='!$.onlyTextMessages' float-toggle @click='openOptions' style='padding: 0 16px;' variant='filled'><obi-icon nome='add'></obi-icon></obi-button>
        <float-container name='mentions_shortcut' style='flex-grow: 1 !important;'>
            <obi-textarea name='messagebox' :messaggio='messaggio' placeholder='Scrivi un messaggio...' righe='1' variant='filled' @keydown='senderShortcut'></obi-textarea>
            <obi-list floating-item='unset' cmd-if='$.shortcuts.length > 0' interact variant='elevated'
                style='position: absolute; bottom: 100%; top: unset; left: 0; z-index: 100; max-height: 200px; overflow-y: auto;'>
                <list-item float-toggle cmd-for='item in shortcuts' :prepend='item.icona' @click='$.tagMember($.item.value)' @click='select' padding-side="md">{{$.item.label}}</list-item>
            </obi-list>
        </float-container>
        <obi-button cmd-if='$.editingMessageId === 0' float-toggle @click='onSendAction' :relevance='relevance' name='btn_submit'><obi-icon nome='send'></obi-icon></obi-button>
        <obi-button cmd-if='$.editingMessageId !== 0' float-toggle @click='edit' :relevance='relevance' name='btn_edit_submit'><obi-icon nome='edit_square'></obi-icon></obi-button>
    </group-component>
</div>`,
    options: {
        inputs: ["chat", "src", "submit", "relevance", "tabs", "progetto", "messaggio", "mailinglist"],
        dataset: {
            chat: new Chat(),
            dragger: false,
            relevance: "primary",
            replyToMessage: null,
            editingMessageId: 0,
            testo: "",
            viewOptions: "",
            details: false,
            viewMessaggi: [],
            src: messaggiApiUrl,
            tabs: [],
            detailsView: "members",
            shortcuts: [],
            attachmentsList: [],
            mailinglist: [],
            email: {
                receivers: [],
                copy: [],
                subject: "",
                copyEnabled: false,
            },
        },
        storage: {
            scrolled: [],
            countMessages: 20,
            updateModelTimer: null,
            timer: null,
            refreshTime: 30000,
        },
        computed: {
            id: function () { return this.__element.getAttribute("ID"); },
            currentUser: function () { return UserHandler.instance.user; },
            isEditable: function () {
                const settings = this.getSettings();
                return !settings.includes("not-editable");
            },
            isRemovable: function () {
                const settings = this.getSettings();
                return settings.includes("removable");
            },
            isReplyable: function () {
                const settings = this.getSettings();
                return !settings.includes("not-replyable");
            },
            isReplying: function () { return this.replyToMessage != null; },
            autorefresh: function () {
                const settings = this.getSettings();
                return settings.includes("autorefresh");
            },
            hasSendOptions: function () {
                return this.__element.querySelector("section[senders]")?.children.length > 0 && this.__element.querySelector("slot[name='senders']") == null;
            },
            onlyTextMessages: function () {
                return this.__element.getAttribute("chat-mode") == "textonly";
            },
            localKey: function () {
                return this.chat.codice ? `${localMessagesKey}.${this.chat.codice}` : null;
            },
            attachments: function () {
                let fileinput = this.__element.querySelector("[obi-file][name='file_attachment']")?.virtual?.context;
                return fileinput && "files" in fileinput ? fileinput.files.length : 0;
            },
            input: function () { return this.__node.getChildContext("obi-textarea[name='messagebox']"); },
            //hasOptions: function () { return this.__element.querySelectorAll("section[options] [obi-button]").length > 1; }
        },
        actions: {
            async visualizzaMessaggi() {
                return await Service.instance.delete(`${notificheApiUrl}/Visualizza?user=${this.currentUser?.id ?? 0}&codice=${this.chat.codice}`)
                    .catch((ex) => handleAPIError(ex, ""));
            },
            async loadMessages() {
                if (this.chat.messages?.length == 0 && this.chat.codice) {
                    if (this.__storage.timer != null) clearTimeout(this.__storage.timer);
                    this.chat.messages = await Service.instance.getJson(`${this.src}/${this.chat.codice}`)
                        .then((list) => list && Array.isArray(list) ? list.map(m => new Message(m)) : [])
                        .catch((ex) => handleAPIError(ex));
                }
                this.update();
                this.updateShortcuts();
                if (!isLocal()) this.viewMessaggi.map((m) => {
                    if (m.hasAttachments)
                        m.loadAttachments()
                            .then(() => this.__element.querySelector("[chat-item][data-id='" + m.id + "']")?.virtual.context.update(m));
                });
                await this.visualizzaMessaggi();
                setTimeout(() => { this.scrollToBottom(); }, 100);
                if (this.autorefresh) this.__storage.timer = setTimeout(() => { this.loadMessages(); }, this.__storage.refreshTime);
                return;
            },
            update(list = []) {
                if (typeof this.chat === "string") return;
                if (!this.chat.messages) this.chat.messages = [];
                if (!list || list.length == 0) list = this.chat.messages.filter(m => m.status != "unsent" && !m.isSeparator);

                list = groupFileMessages(list);

                let local = this.getLocalMessages();
                if (local && local.length) local.map(m => { list.push(m) });

                let i = list.length - 1;
                let lastMessage = null;
                let messages = [];
                while (i >= 0) {
                    let item = list[i];
                    let next = i > 0 ? list[i - 1] : null;
                    if (item) {
                        item.timeStamp = item.timeStamp ? new Date(item.timeStamp) : new Date();
                        if (next) next.timeStamp = next.timeStamp ? new Date(next.timeStamp) : new Date();
                        if (lastMessage) lastMessage.timeStamp = lastMessage.timeStamp ? new Date(lastMessage.timeStamp) : new Date();

                        const isFirst = !next || next.idOwner !== item.idOwner || !sameDate(item.timeStamp, next.timeStamp);
                        const isLast = !lastMessage || lastMessage.idOwner !== item.idOwner || !sameDate(item.timeStamp, lastMessage.timeStamp);
                        let message = new Message({
                            ...item,
                            group: isFirst && isLast ? "single" : isFirst ? "first" : isLast ? "last" : ""
                        });
                        if (message.idRisposta && message.idRisposta != 0) message.repliedMessage = list.find(m => m.id == message.idRisposta);
                        messages.unshift(message);

                        if ((next && !sameDate(item.timeStamp, next.timeStamp)) || i == 0) {
                            messages.unshift(new Message({
                                note: item.timeStamp.toLocaleDateString("it-IT", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', }),
                                isSeparator: true,
                            }));
                        }
                        lastMessage = item;
                    }
                    i--;
                }
                this.viewMessaggi = messages;
                this.render();

                function sameDate(dateA, dateB) {
                    return dateA.getDate() === dateB.getDate() && dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth();
                }
                function groupFileMessages(list) {
                    //Group contiguous messages with only one attachment and no text
                    let groupedList = [];
                    let group = null;
                    let currentUser = null;

                    for (let idx = 0; idx < list.length; idx++) {
                        let item = list[idx];
                        let hasText = !!item.note && item.note.trim() !== "";
                        let hasAttachments = Array.isArray(item.attachments) && item.attachments.length === 1;

                        if (currentUser == item.idOwner && !hasText && hasAttachments) {
                            if (!group) {
                                // Start a new group
                                group = {
                                    ...item,
                                    attachments: [{ documento: item.attachments[0], selected: false, idMessaggio: item.id, idDocumento: item.idAllegato }]
                                };
                            } else {
                                // Add to current group
                                group.attachments.push({ documento: item.attachments[0], selected: false, idMessaggio: item.id, idDocumento: item.idAllegato });
                            }
                        } else {
                            if (group) {
                                groupedList.push(group);
                                group = null;
                            }
                            item.attachments = item.attachments.map(att => ({ documento: att, selected: false, idMessaggio: item.id, idDocumento: item.idAllegato }));
                            groupedList.push(item);
                        }

                        currentUser = item.idOwner;
                    }
                    if (group) {
                        groupedList.push(group);
                    }

                    return groupedList;
                }
            },
            render() {
                const chatList = this.__element.querySelector("[chat-list]");
                if (chatList) {
                    chatList.virtual.removeChildren();
                    this.viewMessaggi.forEach((msx) => { this.renderNewMessage(msx); });
                }
            },
            renderNewMessage(message) {
                const chatList = this.__element.querySelector("[chat-list]");
                let idx = this.viewMessaggi.findIndex(m => m.id == message.id);
                if (idx === -1) return;
                let element = elaborateMessageTemplate(message, idx, {
                    isEditable: this.isEditable,
                    isRemovable: this.isRemovable,
                    isReplyable: this.isReplyable,
                    owner: this.currentUser?.id ?? 0,
                });
                chatList.virtual.append(element);
            },
            onSendAction(evt) {
                if (this.validate()) {
                    if (this.hasSendOptions && this.viewOptions != "senders") {
                        this.viewOptions = "senders";
                        return;
                    }
                    this.senderAction(evt);
                }
            },
            async elaborateMessageContent() {
                if (this.currentUser == null) { obiAlert("Utente non registrato, effettuare il login per inviare il messaggio", { type: "warning" }); return null; }

                const labelUser = `${this.currentUser.username}${this.currentUser.ruolo ? " - " + this.currentUser.ruolo : ""}`;
                var testo = this.input?.valore ?? "";
                let files = this.__element.querySelector("[obi-file][name='file_attachment']")?.virtual?.context;
                let listAttachments = [];
                if (files && files.files.length > 0) {
                    for (const doc of files.getDocuments()) {
                        let dbDocument = await doc.getDBModel({
                            idCategoria: 1,
                            sourceCode: this.progetto ?? "",
                            idUtente: this.currentUser?.id ?? 0
                        });
                        listAttachments.push(dbDocument);
                    }
                }
                return new Message({
                    nome: labelUser,
                    profilo: this.currentUser.profilo,
                    idOwner: this.currentUser.id,
                    idLastUser: this.currentUser.id,
                    idStato: enumStatiMessaggio.Generato,
                    note: formatTesto(testo),
                    attachments: listAttachments,
                    idRisposta: this.replyToMessage?.id ?? 0,
                    codice: this.chat.codice,
                });
            },
            async senderAction(evt, customMessageAction = null) {
                let sender = this.__element.querySelector("div[chat-editor]").virtual;
                return obiLoader(async () => {
                    try {
                        var message = await this.elaborateMessageContent();
                        if (customMessageAction && typeof customMessageAction === "function") customMessageAction(message);
                        await this.send(message);
                        this.input?.submitTrigger();
                        this.viewOptions = "";
                        this.resetForm();
                    } catch (ex) {
                        console.error(ex);
                    }
                }, sender);
            },
            senderShortcut(evt) {
                if (evt) {

                    // Show mentions shortcut only if "@" key is pressed
                    if (evt.key === "@") {
                        let floatContainer = this.__element.querySelector("[float-container][name='mentions_shortcut']");
                        let floatingItem = floatContainer?.querySelector("[floating-item]");
                        openFloatingMenu(floatingItem);
                    }

                    if (evt.key === " ") {
                        closeOpenedMenus();
                    }

                    // Check for Shift (maiusc) + Enter
                    if (evt.shiftKey && evt.key === "Enter") {
                        evt.preventDefault();
                        this.senderAction();
                        return;
                    }
                }
            },
            updateShortcuts() {
                if (!this.chat?.members) return;
                this.shortcuts = this.chat.members.filter(e => e.shortcut === true).map(m => (
                    {
                        label: `@${m.username}`,
                        value: m.username,
                        icona: m.profilo ? `<obi-logo src='${m.profilo}' size='sm' circle></obi-logo>` : (m.icona ?? "<obi-icon nome='account_circle'></obi-icon>"),
                    }));
            },
            async send(message = null) {
                //1. validate message
                if (!message.note && !message.hasAttachments) {
                    obiAlert("Non è possibile inviare un messaggio senza contenuto.", { type: "warning" });
                    return null;
                }
                //2. Render preview
                message.idStato = enumStatiMessaggio.Sospeso;
                if (this.viewMessaggi.some(e => e.id == message.id)) { this.viewMessaggi = this.viewMessaggi.filter(e => e.id != message.id); }
                this.viewMessaggi.push(message);
                this.renderNewMessage(message);
                setTimeout(() => this.scrollToBottom(), 100);

                const { messaggi, notifiche, menzioni } = await processMessageContents.call(this, message);

                try {
                    let sentMessages = [];
                    for (let msx of messaggi) {
                        try {
                            this.__node.trigger("sending", msx);
                            // 2. Update message state and handle local storage
                            this.removeLocalMessage(message.id);
                            // 1. Send the initial post request
                            const res = await Service.instance.post(this.submit || this.src, msx.toDBModel());
                            if (!res?.ok) { if (msx.hasAttachments) continue; else throw new Error(res); }

                            // 3. Update ID from response and push to chat
                            let responseMessage = await res.json();
                            msx.id = responseMessage.id;
                            msx.idStato = responseMessage.idStato;
                            sentMessages.push(msx);
                        } catch (err) {
                            // 6. Error handling logic
                            if (msx.idStato !== enumStatiMessaggio.Errore) {
                                msx.idStato = enumStatiMessaggio.Errore;
                                this.saveLocalMessage(msx);
                            }
                            throw err;
                        }
                    }
                    const textMessage = sentMessages.find(m => !m.hasAttachments);
                    //Carico i messaggi effettivamente inviati nella chat
                    if (sentMessages.length > 0) {
                        //Imposto l'id del messaggio originale
                        message.id = textMessage ? textMessage.id : sentMessages[0];
                        //Se presente l'id del messaggio testuale aggiorno idRisposta ai messaggi con allegato
                        if (textMessage) {
                            for (let msx of sentMessages) {
                                if (msx.hasAttachments) {
                                    msx.idRisposta = textMessage.id;
                                }
                            }
                        }
                        //Inserisco i messaggi nell'array dei messaggi con prima i documenti e dopo il messaggio testuale
                        sentMessages.sort((a, b) => (a.hasAttachments ? 0 : 1) - (b.hasAttachments ? 0 : 1));
                        for (let msx of sentMessages) {
                            this.chat.messages.push(msx);
                            this.__node.trigger("sent", msx);
                        }
                    }

                    // 4. Fire-and-forget notifications (keeping them non-blocking)
                    if (notifiche) {
                        notifiche.idMessaggio = message.id;
                        Service.instance.post(notificheApiUrl, notifiche).catch((ex) => { console.error("Errore nell'invio delle notifiche:", ex); });
                    }

                    // 5. Handle mentions and triggers
                    for (let m of menzioni) {
                        m.idMessaggio = message.id;
                        if (m.idDestinatario) Service.instance.post(notificheApiUrl, m).catch((ex) => { console.error("Errore nell'invio della notifica di menzione:", ex); });
                        this.__node.trigger("mentioned", m);
                    }

                    if (sentMessages.length > 0 && this.email.subject && this.email.receivers.length > 0) {
                        let idMessage = sentMessages[0].id;
                        const me = this;
                        loadApi(`${BASE_URL}/src/models/EmailRequest.js`, async (EmailRequest) => {
                            const url = `${API_URL}/obiHub/api/Hub/Email`;
                            const from = me.currentUser?.email ?? `applicativi@obi-italia.it`;
                            const request = new EmailRequest({
                                header: {
                                    from: from,
                                    sender: from,
                                    copy: me.email.copyEnabled ? (me.email.copy.join(";") || "") : "",
                                    receiver: me.email.receivers.join(";") || "",
                                    subject: me.email.subject,
                                },
                                content: textMessage?.note.split(/(?:<br>|\n)/g) ?? "",
                                files: message?.attachments?.map(d => ({ filename: d.nome, content: d.fileData })) ?? [],
                            });
                            await fetch(url, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(request)
                            }).then(async (res) => {
                                if (!res?.ok) throw new Error(`Errore nell'invio della email: ${res.status} - ${res.statusText}`);
                                const attributo = Message.instanceAttribute({ title: request.header.receiver, icona: "mark_email_read", relevance: "warning" });
                                let chatMessage = me.chat.messages.find(m => m.id === idMessage);
                                chatMessage.attributi.push(attributo);
                                await Service.instance.put(`${me.submit || me.src}/${idMessage}`, chatMessage.toDBModel());
                                me.render();
                            }).catch((ex) => { console.error(ex); obiAlert("Errore nell'invio della email", { type: "error" }); });
                        });
                    }

                    this.__node.trigger("sent", message);
                    return message;

                } catch (ex) {
                    this.__node.trigger("error", ex);
                    obiAlert(ex, { type: "error" }, ex);
                    throw ex;

                } finally {
                    // 7. Always update the UI
                    this.update();
                    setTimeout(() => this.scrollToBottom(), 100);
                }
            },
            async edit() {
                let item = this.chat.messages.find(m => m.id === this.editingMessageId);
                var testo = this.input?.valore ?? "";
                if (!item) { obiAlert("Si è verificato un errore durante il recupero del messaggio.", { type: "warning" }); return; }
                if (!testo) { obiAlert("Non è possibile modificare il messaggio con un testo vuoto.", { type: "warning" }); return; }
                let editor = this.__element.querySelector("[chat-editor] button[name='btn_edit_submit']").virtual;
                obiLoader(async () => {
                    const { messaggi, menzioni } = await processMessageContents.call(this, new Message({ ...item, note: formatTesto(testo), idStato: enumStatiMessaggio.Modificato }));
                    let messaggio = messaggi[0];
                    if (!messaggio) { obiAlert("Si è verificato un errore durante la modifica del messaggio.", { type: "warning" }); return; }
                    let response = await Service.instance.put(`${this.submit || this.src}/${messaggio.id}`, messaggio.toDBModel()).catch((ex) => { console.error(ex); return ex; });
                    if (!response?.ok) { obiAlert("Si è verificato un errore durante la modifica del messaggio.", { type: "error" }); return; }
                    let index = this.chat.messages.findIndex(m => m.id === messaggio.id);
                    if (index >= 0) this.chat.messages[index] = messaggio;

                    let messageItem = this.__element.querySelector(`[chat-item][data-id='${messaggio.id}']`)?.virtual?.context;
                    if (messageItem) messageItem.update(messaggio);
                    this.resetForm();

                    this.__node.trigger("updated", messaggio);

                    for (let m of menzioni) {
                        m.idMessaggio = messaggio.id;
                        if (m.idDestinatario > 0) Service.instance.post(notificheApiUrl, m).catch((ex) => { console.error(ex); });
                        this.__node.trigger("mentioned", m);
                    }
                }, { target: editor, type: "button" });
            },
            removeMessage(msg) {
                obiAlert("Si è sicuri di voler eliminare il messaggio?",
                    {
                        type: "warning",
                        actions: [
                            {
                                name: "Elimina",
                                attributes: { relevance: "danger" },
                                action: async () => {
                                    if (msg.idStato == enumStatiMessaggio.Errore) {
                                        this.removeLocalMessage(msg.id);
                                    } else {

                                        if (msg.attachments.length) {
                                            if (msg.attachments.every(d => d.selected === false)) msg.attachments.map(d => d.selected = true);
                                            for (const doc of msg.attachments) {
                                                if (doc.selected) {
                                                    let response = await Service.instance.delete(`${this.submit || this.src}/${doc.idMessaggio}`).catch((ex) => { return ex; });
                                                    if (!response?.ok) { obiAlert("Si è verificato un errore durante l'eliminazione dell'allegato.", { type: "error" }); return; }
                                                    if (!isLocal()) loadApi(`${API_URL}/OBIArchivio/Scripts/services/documenti.service.js`,
                                                        async (DocumentiService) => { new DocumentiService().removeDocumento(doc.idDocumento).catch((ex) => { console.error(ex); }); });
                                                }
                                            }
                                            msg.attachments = msg.attachments.filter(d => d.selected === false);
                                            if (msg.attachments.length == 0) this.chat.messages = this.chat.messages.filter(m => m.id != msg.id)
                                            else {
                                                const idx = this.chat.messages.findIndex(m => m.id == msg.id);
                                                if (idx !== -1) this.chat.messages[idx] = msg;
                                            }
                                        } else {
                                            let response = await Service.instance.delete(`${this.submit || this.src}/${msg.id}`).catch((ex) => { return ex; });
                                            if (!response?.ok) { obiAlert("Si è verificato un errore durante l'eliminazione del messaggio.", { type: "error" }, response); return; }
                                            this.chat.messages = this.chat.messages.filter(m => m.id != msg.id);
                                        }
                                    }
                                    this.__node.trigger("deleted", msg);
                                    this.update();
                                }
                            }
                        ]
                    });
            },
            saveLocalMessage(message) {
                try {
                    if (!this.chat.codice) return;
                    //Rimuovo il documento se già stato salvato, bastano i riferimenti per recuperarlo in seguito
                    if (message.idAllegato > 0) message.attachments = [];
                    let list = this.getLocalMessages() ?? [];
                    if (!message.id || list.some(m => m.id == message.id) == false) {
                        message.id = list.length > 0 ? Math.max(...list.map(e => e.id || 0)) + 1 : 1;
                        list.push(message);
                    } else {
                        list = list.map(e => e.id == message.id ? message : e);
                    }
                    localStorage.setItem(this.localKey, JSON.stringify(list.map(e => e.toJson())));
                } catch (ex) {
                    log(ex, "error");
                }
            },
            getLocalMessages() {
                try {
                    if (!this.chat.codice) return;
                    return localStorage.getItem(this.localKey) ? JSON.parse(localStorage.getItem(this.localKey)).map(e => {
                        return new Message(e);
                    }) : [];
                } catch (ex) {
                    log(ex, "error");
                }
            },
            removeLocalMessage(id) {
                try {
                    if (!this.id) return;
                    let list = this.getLocalMessages();
                    list = list.filter(m => m.id != id);
                    localStorage.setItem(this.localKey, JSON.stringify(list));
                    this.render();
                } catch (ex) {
                    log(ex, "error");
                }
            },
            scrollToNext() {
                if (this.__storage.scrolled.length > 1) {
                    this.scrollToMessage(this.__storage.scrolled[1]);
                    this.__storage.scrolled.splice(0, 1);
                } else {
                    this.__storage.scrolled = [];
                    this.scrollToBottom();
                }
                sessionStorage.setItem(`scroll_${this.id}`, this.__element.querySelector("[chat-list]").scrollTop);
            },
            scrollToBottom() {
                var chatlist = this.__element.querySelector("[chat-list]");
                if (chatlist) {
                    chatlist.scrollTop = chatlist.scrollHeight;
                }
                sessionStorage.setItem(`scroll_${this.id}`, chatlist.scrollTop);
            },
            scrollToMessage(id) {
                this.showChat(false);
                let container = this.__element.querySelector("[chat-list]");
                let msx = container.querySelector(`[chat-item][value="${id}"]`);
                container.scrollTo({ top: msx.offsetTop - 10, behavior: 'smooth' });
                // Blink the msx element after scrolling by adding style dynamically
                msx.style.transition = 'filter 0.3s';
                msx.style.filter = 'brightness(1.2)';
                setTimeout(() => { msx.style.filter = ''; }, 1000);
                if (!this.__storage.scrolled.some(e => e === id)) this.__storage.scrolled.unshift(id);
                sessionStorage.setItem(`scroll_${this.id}`, container.scrollTop);
            },
            scrollController(evt) {
                let target = evt?.target ?? this.__element.querySelector("[chat-list]");
                const element = this.__element.querySelector("[obi-button][name='scroller']");
                if (!element) return;

                sessionStorage.setItem(`scroll_${this.id}`, target.scrollTop);
                // Show the button only if the user is NOT at the bottom (with a small threshold)
                const threshold = 40; // px from bottom to consider "at bottom"
                const distanceFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

                if (distanceFromBottom > threshold) {
                    element.style.display = 'flex';
                } else {
                    element.style.display = 'none';
                }
            },
            updateScrollPosition(evt) {
                const chatList = this.__element.querySelector("[chat-list]");
                let scrolledRef = sessionStorage.getItem(`scroll_${this.id}`);
                chatList.scrollTop = scrolledRef ? scrolledRef : chatList.scrollHeight;
            },
            dragFocus(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                this.attachToMessage();
            },
            attachToMessage() {
                this.viewOptions = "attachments";
            },
            openEmailForm() {
                this.viewOptions = "emailform";
            },
            openOptions() {
                if (this.viewOptions == "attachments" || this.viewOptions == "options") {
                    this.viewOptions = "";
                    return;
                }
                this.viewOptions = "options";
            },
            resetForm() {
                if (this.input) this.input.valore = "";
                this.viewOptions = "";
                this.dragger = false;
                this.replyToMessage = null;
                this.editingMessageId = 0;
                this.email = {
                    receivers: [],
                    copy: [],
                    subject: "",
                    copyEnabled: false,
                };
                this.__element.querySelectorAll("[obi-chiplist]").forEach(c => c.virtual?.parent.context.syncValue());
                this.setupEmailSender();
                let fileInput = this.__element.querySelector("[obi-file][name='file_attachment']")?.virtual?.context;
                if (fileInput) fileInput.reset();
                this.setupAttachedDocs([]);
            },
            validate() {
                if (this.currentUser == null) {
                    obiAlert("Devi aver effettuato l'accesso per inviare un messaggio.", { type: "warning" });
                    return false;
                }
                if (this.input?.emptyValue && this.attachments == 0) {
                    obiAlert("Inserire un messaggio da inviare.", { type: "warning" });
                    return false;
                }
                return true;
            },
            editMessage(msg) {
                // Remove HTML tags from msg.note (to get plain text)
                this.__storage.tempTesto = this.input?.value ?? "";
                if (this.input) this.input.valore = msg.note ? msg.note.replace(/<[^>]+>/g, "") : "";
                this.replyToMessage = msg;
                this.editingMessageId = msg.id;
            },
            replyTrigger(msg) {
                this.replyToMessage = msg;
            },
            toggleDetails() {
                if (this.details)
                    this.showChat();
                else
                    this.showDetails();
            },
            showDetails() {
                this.details = true;
                this.__node.getChildContext("chat-members")?.getMembers();
                this.__node.getChildContext("chat-media-files")?.getDocumenti();
                this.__node.getChildContext("chat-media-links")?.getLinks();
            },
            showChat(render = true) {
                this.details = false;
                this.detailsView = "members";
                if (render) this.render();
            },
            getSettings() {
                return this.__element.getAttribute("chat-settings") ?? "";
            },
            closeReplyingMessage() {
                this.replyToMessage = null;
                if (this.editingMessageId !== 0) {
                    this.editingMessageId = 0;
                    if (this.input) this.input.valore = this.__storage.tempTesto || "";
                    this.__storage.tempTesto = "";
                }
            },
            updateTrigger(evt) {
                if (this.__storage.updateModelTimer) clearTimeout(this.__storage.updateModelTimer);
                this.__storage.updateModelTimer = setTimeout(() => {
                    this.__node.trigger("model-update", this.chat.model);
                    this.__storage.updateModelTimer = null;
                }, 2000);
                return;
            },
            navigateDetails(evt) {
                let selectedView = evt.currentTarget.getAttribute("value");
                if (this.detailsView === selectedView) return;
                this.detailsView = selectedView;
                this.__node.trigger("details", selectedView);
            },
            tagMember(username) {
                this.showChat(false);
                if (username) {
                    if (this.input) {
                        const textarea = this.input.__element;
                        const contenteditable = textarea.querySelector("[contenteditable]");
                        let value = this.input.valore;

                        // Find the first "@" not followed by a username (not part of @username or email)
                        // Match "@" not followed by a-zA-Z0-9_ (username) or part of an email
                        // We'll use a regex to find the first "@" not followed by a word character
                        const regex = /@(?!(\w))/g;
                        let match = regex.exec(value);

                        if (match) {
                            // Replace only the first such occurrence
                            value = value.slice(0, match.index) + "@" + username + value.slice(match.index + 1) + " ";
                            this.input.valore = value;
                            closeTagList(contenteditable, match.index + username.length + 1);
                        } else {
                            // If no such @ is found, just append @username
                            this.input.valore = this.input.emptyValue ? `@${username} ` : value + `@${username} `;
                            closeTagList(contenteditable, this.input.valore.length);
                        }
                    }
                }
                function closeTagList(element, newpos) {
                    setTimeout(() => {
                        closeOpenedMenus();
                        if (element) {
                            element.focus();
                            element.selectionStart = element.selectionEnd = newPos;
                        }
                    }, 100);
                }
            },
            setupAttachedDocs(files) {
                const key = "documenti";
                this.attachmentsList = this.attachmentsList.filter(a => a.label != key);
                if (files.length) this.attachmentsList.push({ label: key, count: files.length, icon: "attach_file", color: 'tertiary', source: 'attachments' });
            },
            setupEmailSender() {
                const key = "email";
                this.attachmentsList = this.attachmentsList.filter(a => a.label != key);
                if (this.email.receivers.length > 0 && this.email.subject)
                    this.attachmentsList.push({ label: key, icon: "alternate_email", count: 0, color: 'warning', source: 'emailform' });
            },
        },
        events: [
            {
                name: "progress",
                action: function (state) {
                    switch (state) {
                        case "mounted":
                            if (this.currentUser) {
                                this.loadMessages();
                                this.scrollController();
                                this.updateShortcuts();
                            }
                            break;
                    }
                }
            },
            {
                name: "render",
                action: function () {
                    this.scrollController();
                }
            },
            {
                name: "retry",
                action: function (item) {
                    this.send(item);
                }
            }
        ]
    },
});

// Finds URLs and emails (possibly multiple, separated by ;) in text and wraps them with HTML anchor tags
function formatTesto(text) {
    if (!text) return "";
    // Regex for URLs
    const urlPattern = /(\bhttps?:\/\/[^\s<]+[^\s<\.\,\)\]\!])/gi;
    // Regex for emails (single or multiple separated by ;)
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\s*;\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*)/gi;
    // Regex for mentions (@username)
    const mentionPattern = /@([a-zA-Z0-9_]+)/g;

    // Replace URLs
    let linked = text.replace(urlPattern, function (url) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // Replace emails (handle multiple separated by ;)
    linked = linked.replace(emailPattern, function (emailGroup) {
        return emailGroup
            .split(/\s*;\s*/)
            .map(email => `<a href="mailto:${email}">${email}</a>`)
            .join("; ");
    });

    // Replace mentions
    linked = linked.replace(mentionPattern, function (match, mention) {
        return `<strong text-color='info'>@${mention}</strong>`;
    });

    return linked;
}

defineComponent({
    selector: "obi-chat-component",
    template:
        `<test-template name='OBI CHAT' description='' :code='code'>
        </test-template>`,
    options: {
        computed: {
            code: function () {
                return `<obi-chat url='http://localhost:3000/Messages' user="mbiagini"></obi-chat>`;
            }
        }
    }
});

function elaborateMessageTemplate(message, index, options) {
    let owner = message.idOwner == options.owner ?? 0;
    let isEditable = options.isEditable && owner;
    let isRemovable = options.isRemovable || owner;

    // Use a template element to convert the HTML string to a Node
    const template = document.createElement("template");
    template.innerHTML = `<chat-item :messaggio='$.viewMessaggi[${index}]' data-id='${message.id}'
                        @remove='removeMessage' @edit='editMessage' @reply='replyTrigger' @navigate='scrollToMessage'
                        ${owner ? "owner" : ""} 
                        ${isEditable ? "editable" : ""} 
                        ${isRemovable ? "removable" : ""} 
                        ${options.isReplyable ? "replyable" : ""} ></chat-item>`;
    return template.content.firstElementChild;
}

/**
 * Elabora i modelli dal server in caso di connessione locale ed estrae la lista delle notifiche e delle menzioni
 *
 * @async
 * @param {*} messaggio 
 * @returns {unknown} 
 */
async function processMessageContents(messaggio) {

    let notifiche = null;
    let menzioni = []
    let messaggi = [];

    // Separate text message from file messages
    if (messaggio.note) messaggi.push(new Message({ ...messaggio, attachments: [] }));
    for (const doc of messaggio.attachments) {
        messaggi.push(new Message({ ...messaggio, note: "", attachments: [doc] }));
    }

    // Dynamically import Messaggio and Notifica if not running on localhost
    if (!isLocal()) {
        await loadApi(
            `${API_URL}/OBIcomunicazioni/scripts/models/notifica.model.js`,
            `${API_URL}/OBIArchivio/Scripts/services/documenti.service.js`,
            async (Notifica, DocumentiService) => {
                const service = new DocumentiService();
                for (const msx of messaggi) {
                    if (msx.hasAttachments && msx.idAllegato == 0) {
                        let output = await service.addDocumento(msx.attachments[0]);
                        msx.idAllegato = output.id;
                    }
                }
                const destinatari = this.chat.members.filter(u => u.id > 0).map(e => (e.id));
                notifiche = Notifica.nuovoMessaggio(this.chat, messaggio, destinatari, this.progetto);

                const mentionMatches = messaggio.note ? messaggio.note.match(/@([a-zA-Z0-9_]+)/g) : null;
                menzioni = Array.isArray(mentionMatches) ? mentionMatches.map(username => Notifica.nuovaMenzione(this.chat, messaggio, username.replace("@", ""), { progetto: this.progetto })) : [];
            });
    }
    return { messaggi, notifiche, menzioni };
}