import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import UserHandler from "../../LAMP/UserModule/LampAccess.js";
import { asyncDataLoader, loadApi, obiAlert } from "../../core.js";
import { API_URL } from "../../obi.config.js";
import Chat from "../../src/models/Chat.js";
import Message from "../../src/models/Message.js";

var scrolltop = 0;

const SAMPLE_TASKS = [
    {
        id: 101,
        idStato: 1,
        idProgetto: 0,
        nome: "Richiesta nuovo accesso",
        note: "Ho bisogno di accesso alla cartella con le specifiche.",
        tags: "Accesso,Onboarding",
        insertTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        timeStamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        idOwner: 1001,
        owner: "Alessandro Bianchi",
        progetto: "Area IT",
        stato: "Nuova",
        messaggi: 1,
        responsabili: [{ username: "marta.rossi", email: "marta.rossi@obi-italia.it" }]
    },
    {
        id: 102,
        idStato: 2,
        idProgetto: 0,
        nome: "Verifica documentazione",
        note: "Controllare i documenti inviati dal cliente.",
        tags: "Verifica,Documenti",
        insertTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        timeStamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        idOwner: 1002,
        owner: "Lucia Esposito",
        progetto: "Area IT",
        stato: "Approvata",
        messaggi: 0,
        responsabili: [{ username: "andrea.neri", email: "andrea.neri@obi-italia.it" }],
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    {
        id: 103,
        idStato: 3,
        idProgetto: 0,
        nome: "Sviluppo funzionalità",
        note: "Implementare il filtro per le attività.",
        tags: "Sviluppo,Task",
        insertTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        timeStamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        idOwner: 1003,
        owner: "Giulia Verdi",
        progetto: "Area IT",
        stato: "In Corso",
        messaggi: 3,
        responsabili: [{ username: "marco.longo", email: "marco.longo@obi-italia.it" }],
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    {
        id: 104,
        idStato: 4,
        idProgetto: 0,
        nome: "Test e collaudo",
        note: "Eseguire i test end-to-end dopo la modifica.",
        tags: "Test,QA",
        insertTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        timeStamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        idOwner: 1004,
        owner: "Francesca Neri",
        progetto: "Area IT",
        stato: "In Lavorazione",
        messaggi: 0,
        responsabili: [{ username: "davide.musso", email: "davide.musso@obi-italia.it" }],
        startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    },
    {
        id: 105,
        idStato: 5,
        idProgetto: 0,
        nome: "Consegna release",
        note: "Rilasciata versione 1.2.0 in produzione.",
        tags: "Release,Versione",
        insertTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        timeStamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        idOwner: 1005,
        owner: "Elena Ferri",
        progetto: "Area IT",
        stato: "Pubblicata",
        messaggi: 0,
        responsabili: [{ username: "sara.lima", email: "sara.lima@obi-italia.it" }],
        endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        versione: "1.2.0"
    },
    {
        id: 106,
        idStato: 6,
        idProgetto: 0,
        nome: "Richiesta archiviata",
        note: "Richiesta chiusa e archiviata.",
        tags: "Archiviata,Supporto",
        insertTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        timeStamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        idOwner: 1006,
        owner: "Carlo De Santis",
        progetto: "Area IT",
        stato: "Archiviata",
        messaggi: 0,
        responsabili: [{ username: "maria.poli", email: "maria.poli@obi-italia.it" }],
        startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    }
];

defineComponent({
    selector: "obi-task-chat",
    template: `<obi-modal size='file'>
            <div style='width: 100%; margin-top: 32px; align-items: center' display-column>
                <obi-chat id='task_chat' :chat='chat' style="width: 100%; max-height: 90vh; height: 90vh;" padding='none' progetto='OBITasks'
                    @sending='onSending' @complete='onComplete' @uncomplete='onUncomplete' @mentioned='onMention'></obi-chat>
            </div>
        </obi-modal>`,
    options: {
        computed: {
            tasks: function () { return document.querySelector("obi-task-view")?.virtual?.parent.context?.tasks || []; },
            chatElement: function () { return this.__node.getChildContext("obi-chat"); },
        },
        actions: {
            onSending(message) {
                if (!message.hasAttachments && !message.idRisposta) {
                    const tag = Message.instanceAttribute({ label: "Risolvi", relevance: "success", variant: "filled", event: "complete" });
                    message.attributi.push(tag);
                    let task = this.tasks.find(t => message.codice === `TSK${t.id}`);
                    if (task) task.messaggi++;
                }
            },
            async onComplete(message) {
                const index = message.attributi.findIndex(e => e.label === "Risolvi");
                if (index !== -1) {
                    message.attributi.splice(index, 1, Message.instanceAttribute({ title: "Risolto", icona: "check_circle", relevance: "neutral", event: "uncomplete" }));
                }
                await loadApi("${API_URL}/obicomunicazioni/scripts/services/messaggi.service.js", async (Service) => {
                    const service = new Service();
                    await service.editMessaggio(new Message(message));
                });
                this.chatElement.render();
                let indexTask = this.tasks.findIndex(t => message.codice === `TSK${t.id}`);
                if (indexTask !== -1) this.tasks[indexTask].messaggi--;
                if (this.chatElement?.chat.model) this.chatElement.chat.model.messaggi--;
            },
            async onUncomplete(message) {
                const index = message.attributi.findIndex(e => e.title === "Risolto");
                if (index !== -1) {
                    message.attributi.splice(index, 1, Message.instanceAttribute({ label: "Risolvi", relevance: "success", variant: "filled", event: "complete" }));
                }
                await loadApi("${API_URL}/obicomunicazioni/scripts/services/messaggi.service.js", async (Service) => {
                    const service = new Service();
                    await service.editMessaggio(new Message(message));
                });
                this.chatElement.render();
                let indexTask = this.tasks.findIndex(t => message.codice === `TSK${t.id}`);
                if (indexTask !== -1) this.tasks[indexTask].messaggi++;
                if (this.chatElement?.chat.model) this.chatElement.chat.model.messaggi++;
            },
            async onMention(mention) {
                await loadApi("${API_URL}/obiComunicazioni/Scripts/Services/notifiche.service.js",
                    "${API_URL}/obihub/scripts/services/tasks.service.js",
                    "${API_URL}/obihub/scripts/services/progetti.service.js",
                    async (NotificheService, TaskService, ProgettiService) => {
                        const notificheService = new NotificheService();
                        const progettiService = new ProgettiService();

                        const taskService = new TaskService();
                        const task = this.chatElement.chat.model;
                        if (!task) { obiAlert("Impossibile recuperare la richiesta", { type: "error" }); return; }
                        const progetto = await progettiService.getProgetto(task.idProgetto);
                        if (!progetto) { obiAlert("Impossibile recuperare il progetto", { type: "error" }); return; }
                        const taskowner = this.chatElement.chat.members.find(m => m.id == task.idOwner);
                        if (!taskowner) { obiAlert("Impossibile recuperare il proprietario della richiesta", { type: "error" }); return; }

                        if (mention.username == 'assistenza') {
                            mention.nome = `TSK${task.id}.${progetto.label} - ${task.nome}`;
                            mention.note = `Richiesta su: ${progetto.nome}\nRichiesta da: ${taskowner.nome} ${taskowner.cognome}\n\n${task.note}`;
                            mention.userEmail = taskowner.email;
                            if (task.idStato === 1) {
                                obiAlert("Si è sicuri di archiviare la richiesta?",
                                    {
                                        type: "warning",
                                        actions: [
                                            {
                                                name: "Conferma",
                                                action: async () => {
                                                    task.idStato = 6;
                                                    if (task.taglist) task.taglist.push("HelpDesk");
                                                    else task.tags = task.tags ? `${task.tags},HelpDesk` : "HelpDesk";
                                                    let res = await taskService.updateTask(task);
                                                    document.querySelector("div[obi-card][kanban]")?.virtual?.parent?.context?.refreshLists();
                                                    if (res) obiAlert("Richiesta archiviata con successo", { type: "success" });
                                                    this.modalChat.close();
                                                }
                                            }
                                        ]
                                    });
                            }
                        }

                        mention.nome = `Nuovo messaggio nel task '${task.nome}' per il progetto ${task.progetto}`;
                        mention.link = progetto.installazione;
                        await notificheService.sendMenzione(mention);
                    });
            }
        }
    }
});

defineComponent({
    selector: "obi-task-item",
    template: `<obi-card :variant='$.task.idStato < 6 ? "filled" : "outlined"' :obi-task='task.id' margin='none' @click='openProjectIntoHub' :interactable='intoHub'>
        <card-header padding='sm'>
            {{task.icon}}
            <obi-title :titolo='task.nome' :descrizione='$.intoHub ? $.task.progetto : ""' :text-color='$.task.expired ? "danger" : ""' flex-size='auto' style='font-size: 1em;' margin-side='sm'></obi-title>
            {{task.stampOwnerInfo}}
        </card-header>
        <card-body padding='sm'>{{task.stampDetails}}</card-body>
        <obi-slider min='0' thin progress :valore='task.progresso' margin-side='sm'></obi-slider>
        <card-action cmd-if='$.task.idStato < 6' padding='sm'>
            <obi-button :data-id='task.id' relevance='info' variant='outlined' prepend='<obi-icon nome="chat"></obi-icon>' :label='task.messaggi' @click='openChat'
                style='border: 0px; height: 40px;' margin='none'></obi-button>
        </card-action>
    </obi-card>`,
    options: {
        inputs: ["task"],
        computed: {
            intoHub: function () { return this.__app.name === "portale_hub"; },
            chatElement: function () { return document.getElementById("task_chat")?.virtual?.context; }
        },
        actions: {
            async openChat() {
                if (!this.chatElement) return obiAlert("La chat non è stata impostata", { type: "error" });
                if (this.task.idStato >= 6) return obiAlert("Non è possibile aprire la chat di una richiesta archiviata", { type: "warning" });
                await instanceChat(this.task, this.chatElement);
                this.chatElement.__element.closest("[obi-modal]")?.virtual?.context.open();
            },
            openProjectIntoHub() {
                this.__app.handler.trigger("openproject", this.task.idProgetto);
            }
        }
    }
});

defineComponent({
    selector: "obi-tasks-view",
    template: `<section obi-tasks>
        <obi-card style='margin: 0; border-radius: unset; flex-grow: 1; max-height: 90vh'>
            <card-header :prepend='prependSupport' titolo='RICHIESTE' margin='sm'>
                <obi-button cmd-if='$.currentUser != null && $.progetto > 0' relevance='secondary' @click='openRequest'><obi-icon nome='add_diamond' title='Nuova Richiesta'></obi-icon></obi-button>
            </card-header>
            <card-body gap='sm' padding='sm'>
                <div display-row='wrap' gap='sm'>
                    <obi-chip cmd-if='$.currentUser != null' label='Mie Richieste' @click='setFilter' data-value='my_requests' :variant='$.filter == "my_requests" ? "filled" : "outlined"' relevance='primary' interactable></obi-chip>
                    <obi-chip label='Nuove' @click='setFilter' data-value='requested' :variant='$.filter == "requested" ? "filled" : "outlined"' relevance='primary' interactable></obi-chip>
                    <obi-chip label='In Corso' @click='setFilter' data-value='approved' :variant='$.filter == "approved" ? "filled" : "outlined"' relevance='primary' interactable></obi-chip>
                    <obi-chip label='Pubblicate' @click='setFilter' data-value='published' :variant='$.filter == "published" ? "filled" : "outlined"' relevance='primary' interactable></obi-chip>
                    <obi-chip @click='setFilter' data-value='trash' :variant='$.filter == "trash" ? "filled" : "outlined"' relevance='danger' interactable title='Richieste Archiviate'><obi-icon nome='delete'></obi-icon></obi-chip>
                </div>
                <obi-chiplist label='Filtra per Tag' :options='tagsListOptions' :valore='tagsFilter'></obi-chiplist>
                <div @scroll='onTasksScroll' display-column gap='xs' style='overflow-y: auto;'>
                    <obi-task-item cmd-for='task in filteredTasks' :task='task'></obi-task-item>
                    <div cmd-if='$.filteredTasks.length == 0' class='txt-body2' style='text-align: center; padding: 16px;'>Nessuna attività trovata.</div>
                </div>
            </card-body>
        </obi-card>
        <obi-modal name='form_request' size='file'>
            <obi-card titolo='Nuova Richiesta'>
                <obi-form @action='submitRequest' slot='corpo' :modello='requestData' label='Invia' icona='send'>
                    <div slot='inputForm' display-column gap='sm'>
                        <obi-textbox label='Titolo' :valore='requestData.nome' count='50' required='required'></obi-textbox>
                        <obi-textarea label='Descrizione' :valore='requestData.note' righe='4' required='required' :messaggio='bugWarning'></obi-textarea>
                        <obi-checkbox label='Segnala un Errore di Sistema' :valore='requestData.isBug' toggle></obi-checkbox>
                    </div>
                </obi-form>
            </obi-card>
        </obi-modal>
    </section>`,
    options: {
        inputs: ["progetto"],
        dataset: {
            progetto: 0,
            displayRequest: null,
            filter: "",
            tagsFilter: [],
            requestData: {
                idProgetto: 0,
                idStato: 0,
                nome: "",
                note: "",
                tags: "",
                isBug: false
            },
            tasks: [],
            loadedTasksCount: 10,
        },
        computed: {
            tagsListOptions: function () {
                return this.getTagsList().map(e => ({ value: e, label: e }));
            },
            prependSupport: function () {
                return `<obi-icon nome='contact_support'></obi-icon>`;
            },
            bugWarning: function () {
                return this.requestData.isBug ? `<div display-row gap='xs'><obi-icon nome='warning'></obi-icon> Se stai segnalando un malfunzionamento ricorda di fornire una descrizione dettagliata del bug, inclusi i passaggi per riprodurre il problema.</div>` : "";
            },
            filteredTasks: function () {
                let currentUserId = this.currentUser?.id || 0;
                let filtered = [];
                if (this.filter === 'my_requests') {
                    filtered = this.tasks.filter(t => t.idOwner === currentUserId);
                } else if (this.filter === 'approved') {
                    filtered = this.tasks.filter(t => t.idStato === 3);
                    filtered.sort((a, b) => {
                        // 1. Handle cases where one or both deadlines are missing (null/undefined)
                        if (!a.deadline) return !b.deadline ? 0 : 1;
                        if (!b.deadline) return -1;

                        // 2. ASCENDING: Swap a and b so the earliest date comes first
                        return new Date(a.deadline) - new Date(b.deadline);
                    });
                } else if (this.filter === 'requested') {
                    filtered = this.tasks.filter(t => t.idStato === 1);
                    filtered.sort((a, b) => new Date(a.insertTime) - new Date(b.insertTime));
                } else if (this.filter === 'published') {
                    filtered = this.tasks.filter(t => t.idStato === 5);
                } else if (this.filter === 'trash') {
                    filtered = this.tasks.filter(t => t.idStato === 6);
                } else {
                    filtered = this.tasks.filter(t => t.idStato !== 6 && t.idStato !== 5);
                }
                const lowerTagsFilter = this.tagsFilter.map(tag => tag.toLowerCase());
                if (this.tagsFilter.length) {
                    filtered = filtered.filter(e => {
                        const taskTags = (e.listaInformazioni?.toLowerCase() ?? '')
                            .split(',')
                            .map(tag => tag.trim());
                        return lowerTagsFilter.every(tag => taskTags.includes(tag));
                    });
                }

                return filtered.slice(0, this.loadedTasksCount);
            },
            modalForm: function () { return this.__node.getChildContext("obi-modal[name='form_request']"); },
            currentUser: function () { return UserHandler.instance.user; },
        },
        storage: {
            loadTasksTimer: null,
        },
        actions: {
            onTasksScroll(evt) {
                const target = evt.currentTarget;
                if (!target) return;

                const { scrollTop, scrollHeight, clientHeight } = target;

                scrolltop = scrollTop;

                if (scrollTop + clientHeight >= scrollHeight - 10) {
                    if (this.loadedTasksCount < this.filteredTasks.length) {
                        this.loadedTasksCount += 10;
                        setTimeout(() => {
                            target.scrollTop = scrolltop;
                        }, 500);
                    }
                } else if (scrollTop === 0 && this.loadedTasksCount > 10) {
                    this.loadedTasksCount -= 10;
                    setTimeout(() => {
                        target.scrollTop = scrolltop;
                    }, 500);
                }
            },
            async loadTasks() {
                this.loadedTasksCount = 10;
                const url = this.progetto > 0 ?
                    `${API_URL}/obihub/api/progetti/${this.progetto}/tasks` :
                    `${API_URL}/obihub/api/tasks`;
                let response = await fetch(url).then(res => res.json()).catch(err => {
                    console.error(err);
                    return null;
                });
                if (response) {
                    const TaskModel = await loadApi("${API_URL}/obihub/scripts/models/task.model.js");
                    this.tasks = TaskModel ? response.map(e => new TaskModel(e)) : response;
                } else {
                    this.tasks = SAMPLE_TASKS;;
                }

                if (this.__storage.loadTasksTimer) clearTimeout(this.__storage.loadTasksTimer);
                this.__storage.loadTasksTimer = setTimeout(() => {
                    this.loadTasks();
                    if (this.filter === "trash") this.loadArchivedTasks();
                    if (this.filter === "published") this.loadPublishedTasks();
                }, 2 * 60 * 1000);
            },
            setFilter(evt) {
                const target = evt.currentTarget;
                const value = target.getAttribute("data-value");
                if (value) {
                    this.loadedTasksCount = 10;
                    this.filter = this.filter == value ? "" : value;
                    if (value === "trash") {
                        this.loadArchivedTasks();
                    }
                    if (value === "published") {
                        this.loadPublishedTasks();
                    }
                }
            },
            async loadArchivedTasks() {
                if (!Number(this.progetto ?? 0)) return;
                await loadApi("${API_URL}/obihub/scripts/models/task.model.js", async (TaskModel) => {
                    const url = `${API_URL}/obihub/api/progetti/${this.progetto}/tasks/archived`;
                    let response = await fetch(url).then(res => res.json()).catch(err => console.error(err));
                    if (response) {
                        this.tasks = this.tasks.filter(e => e.idStato !== 6);
                        this.tasks = this.tasks.concat(response.map(e => new TaskModel(e)));
                    }
                });
            },
            async loadPublishedTasks() {
                if (!Number(this.progetto ?? 0)) return;
                await loadApi("${API_URL}/obihub/scripts/models/task.model.js", async (TaskModel) => {
                    const url = `${API_URL}/obihub/api/progetti/${this.progetto}/tasks/published`;
                    let response = await fetch(url).then(res => res.json()).catch(err => console.error(err));
                    if (response) {
                        this.tasks = this.tasks.filter(e => e.idStato !== 5);
                        this.tasks = this.tasks.concat(response.map(e => new TaskModel(e)));
                    }
                });
            },
            openRequest() {
                this.requestData = { idProgetto: this.progetto, idStato: 1, nome: "", note: "", tags: "", isBug: false };
                this.modalForm?.open();
            },
            closeRequest() {
                this.modalForm?.close();
            },
            async submitRequest(data) {
                if (!this.currentUser) {
                    obiAlert("Effettuare il login per inviare una richiesta", { type: "warning" });
                    return;
                }
                await loadApi("${API_URL}/obihub/scripts/services/tasks.service.js",
                    "${API_URL}/obihub/scripts/models/task.model.js", async (Service, taskModel) => {
                        const taskService = new Service();
                        let task = new taskModel({
                            ...data,
                            idProgetto: this.progetto,
                            idStato: 1,
                            idOwner: this.currentUser?.id,
                            timeStamp: new Date(),
                            tags: data.isBug ? "Debug" : ""
                        });
                        task = await taskService.createTask(task);
                        this.tasks.unshift(task);
                        this.closeRequest();
                    });
            },
            getTagsList() {
                const tags = this.tasks.flatMap(t => (t.tags || '').split(',').map(s => s.trim()).filter(s => s !== ''));
                return [...new Set(tags)];
            }
        },
        events: [
            asyncDataLoader.call(this, async function () {
                await this.loadTasks();
            }),
        ]
    }
});

defineComponent({
    selector: "obi-tasks",
    template: `<float-container element='obi-tasks'>
            <obi-button tool-item relevance="brand" icon float-toggle @click='loadTasks'>
                <obi-icon nome='task_alt' title='Supporto e Richieste'></obi-icon>
            </obi-button>
            <obi-tasks-view :progetto='progetto' floating-item='bottom right' rounded variant="elevated" style='width: 700px;'></obi-tasks-view>
        </float-container>
        <obi-task-chat></obi-task-chat>`,
    options: {
        inputs: ["progetto"],
        dataset: {},
        computed: {},
        storage: {},
        actions: {},
        events: []
    }
});

export async function instanceChat(task, chatElement) {
    if (!task || !chatElement) return null;

    const owner = await loadApi("${API_URL}/obihub/scripts/services/utenti.service.js", async (Service) => {
        const userService = new Service();
        let owner = await userService.getUtente(task.idOwner);
        if (!owner) return null;
        owner.ruolo = "Owner";
        return owner;
    });

    const assitenza = { username: "assistenza", email: "assistenza-it@obi-italia.it", icona: '<obi-icon nome="support_agent"></obi-icon>', ruolo: "" };
    let responsabili = owner ? [assitenza, owner].concat(task.responsabili.map(u => ({ ...u, ruolo: "Responsabili" }))) : [assitenza];

    const codice = `TSK${task.id}`;
    chatElement.chat = new Chat({
        model: task,
        codice: codice,
        nome: task.nome,
        note: task.note,
        members: responsabili,
        messages: [],
    });
    chatElement.detailsView = "members";
    chatElement.details = false;

    await chatElement.loadMessages();
    if (task.note) {
        chatElement.chat.messages.unshift(new Message({
            codice: codice,
            nome: task.owner,
            note: task.note,
            idOwner: task.idOwner,
            timeStamp: task.timeStamp,
            insertTime: task.insertTime
        }));
        chatElement.update();
    }
}