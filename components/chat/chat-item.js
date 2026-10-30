import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import Message, { enumStatiMessaggio } from "../../src/models/Message.js";

defineComponent({
    selector: "chat-item",
    template: `
        <div chat-item :value='messaggio.id' :separator='isSeparator' :group='messaggio.group' :status='messaggio.stato'>
            <section cmd-if='$.messaggio && $.messaggio?.idRisposta != 0' chat-replied-message @click='goToRepliedTrigger'>
                <obi-title size='sm' reverse :titolo='messaggio.repliedMessage.note' :descrizione='messaggio.repliedMessage.nome'></obi-title>
            </section>
            <div cmd-if='isSeparator'>{{messaggio.note}}</div>
            <div cmd-else chat-item-message>
                <div chat-user-profile>
                    <img cmd-if='$.messaggio.profilo' :src='messaggio.profilo' :alt='messaggio.nome'/>
                    <span cmd-else>{{shortUser}}</span>
                </div>
                <div chat-message-details gap='sm'>
                    <span :title='messaggio.nome'>{{messaggio.nome}}</span>
                    <span>{{messaggio.time}}</span>
                    <group-component variant='filled' relevance='primary'>
                        <obi-button cmd-if='isReplyable' title='Rispondi' @click='replyTrigger'><obi-icon nome='reply'></obi-icon></obi-button>
                        <obi-button cmd-if='isEditable' title='Modifica' @click='editTrigger'><obi-icon nome='edit'></obi-icon></obi-button>
                        <obi-button cmd-if='isRemovable' title='Elimina' @click='removeTrigger'><obi-icon nome='delete'></obi-icon></obi-button>
                    </group-component>
                    <obi-button cmd-if='isErrorState' interactable name='remove' relevance='danger' @click='removeTrigger' title='Annulla'>
                        <obi-icon nome='delete'></obi-icon>
                    </obi-button>
                    <obi-button cmd-if='isErrorState' interactable name='retry' data-action="retry" relevance='tertiary' @click='tagClick' title='Riprova'>
                        <obi-icon nome='redo'></obi-icon>
                    </obi-button>
                </div>
                <div chat-message-content>
                    <div cmd-if='messaggio.hasAttachments' display-grid>
                        <obi-filecard grid-size='3' cmd-for='item in messaggio.attachments' variant='filled' :file='item.documento'>
                            <input cmd-if='$.messaggio.attachments.length > 1' type='checkbox' cmd-model='item.selected'
                                style='position: absolute; top: 0; left: 0; height: 24px; width: 24px;'></input>
                        </obi-filecard>
                    </div>
                    <span cmd-else cmd-model='messaggio.note'></span>
                </div>
                <div chat-message-tags gap='sm'>
                    <obi-chip interactable cmd-for='item in messaggio.attributi' :title='item.title'
                        :label='item.label' :relevance='item.color' :variant='item.variant'
                        :data-value=':index' @click='tagClick'>
                        <obi-icon cmd-if='$.item.icona != null && $.item.icona != ""' :nome='item.icona'></obi-icon>
                    </obi-chip>
                    <obi-chip cmd-if='messaggio.edited' padding='none' title='Modificato' font-type='caption' text-color='neutral'>modificato</obi-chip>
                </div>
            </div>
        </div>
    `,
    options: {
        inputs: ["messaggio"],
        computed: {
            isDocument: function () { return this.messaggio?.isAttachment; },
            isSeparator: function () { return this.messaggio?.isSeparator; },
            isLast: function () { return this.messaggio?.last; },
            shortUser: function () {
                return this.messaggio.nome.slice(0, 2).toUpperCase();
            },
            isInteractable: function () {
                return this.isRemovable && this.isReplyable;
            },
            isEditable: function () {
                return this.__element.hasAttribute("editable") && !this.messaggio.unsent && !this.messaggio.hasAttachments;
            },
            isRemovable: function () {
                return this.__element.hasAttribute("removable") && !this.messaggio.unsent;
            },
            isReplyable: function () {
                return this.__element.hasAttribute("replyable") && !this.messaggio.unsent;
            },
            isSelectable: function () {
                return this.__element.hasAttribute("owner") && !this.messaggio.unsent;
            },
            isErrorState: function () { return this.messaggio?.idStato == enumStatiMessaggio.Errore; },
            isOnlyReplyable: function () { return this.isReplyable && !this.isEditable && !this.isRemovable; },
        },
        actions: {
            tagClick: function (evt) {
                let index = evt.currentTarget.getAttribute("data-value");
                let attribute = this.messaggio.attributi[index];
                if (attribute.event) this.__node.getParent({ nodeName: "obi-chat" }).trigger(attribute.event, this.messaggio);
                if (attribute.script) try { let attrmodel = Message.instanceAttribute(attribute); attrmodel.action.call(attrmodel, this.messaggio); } catch (ex) { console.error(ex); }
            },
            editTrigger: function (evt) {
                this.__node.trigger("edit", this.messaggio);
            },
            replyTrigger: function (evt) {
                this.__node.trigger("reply", this.messaggio);
            },
            removeTrigger: function (evt) {
                this.__node.trigger("remove", this.messaggio);
            },
            checkTrigger: function (evt) {
                this.__node.trigger("select", this.messaggio);
            },
            goToRepliedTrigger(evt) {
                this.__node.trigger("navigate", this.messaggio.idRisposta);
            },
            update(item) {
                if (!(item instanceof Message)) return;
                this.messaggio = new Message({ ...item });
                if (item.hasAttachments) {
                    this.messaggio.attachments = [...item.attachments];
                    // this.__element.querySelectorAll("[obi-card='file']")
                    //     .forEach((el, i) => {
                    //         el.virtual?.context.setup(item.attachments[i].documento);
                    //     });
                } else {
                    this.__element.querySelector("[chat-message-content]").innerHTML = item.note;
                }
            },
        },
        events: [],
    }
});