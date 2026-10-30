import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import UserHandler from "../../LAMP/UserModule/LampAccess.js";
import { obiAlert } from "../../core.js";
import { API_URL } from "../../obi.config.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";

defineComponent({
    selector: "obi-dashboard",
    template: `<float-container element='obi-dashboard'>
        <obi-button cmd-if='logged' tool-item relevance="brand" icon float-toggle>
            <obi-icon nome='apps' title='Applicativi OBI'>
                <obi-badge cmd-if='$.viewNotifiche.length > 0' dot style='left: 70%' relevance='secondary'></obi-badge>
            </obi-icon>
        </obi-button>
        <section apps-container floating-item='bottom right' rounded variant="elevated" style='width: 450px; padding: 0;'>
            <div display-column>
                <obi-card variant="filled" descrizione='DASHBOARD' style='margin: 0; border-radius: unset' :prepend='prependDashboard'>
                    <div display-grid gap='xs' style='max-height: 314px; padding: 8px; padding-top: unset; overflow-y: auto;' x4>
                        <obi-card cmd-for='item in apps' grid-size='2' margin='none' interactable column :prepend="$.getLogo($.item)"
                        :descrizione='item.label' :data-value='item.id' @click='openApp'variant="filled">
                            <obi-badge cmd-if='item.hasNotifiche' relevance='primary' dot style='top: 12px;'></obi-badge>
                        </obi-card>
                    </div>
                </obi-card>
                <obi-card variant="filled" style='margin: 0; border-radius: unset'>
                    <card-header titolo='' :sottotitolo='sottotitoloNotifiche' :prepend='prependNotifiche' style='padding-left: 24px; padding-right: 8px;'>
                        <group-component cmd-if='$.notifiche.length > 5' style='margin-left: 16px;'>
                            <obi-textbox variant='filled' label='Cerca' :valore='ricerca' @keyup='updateViewNotifiche'></obi-textbox>
                            <obi-button relevance='success' title='Visualizza tutte le notifiche' @click='viewAll' icon style='margin: 8px 0 0 0'><obi-icon nome='checklist'></obi-icon></obi-button>
                        </group-component>
                    </card-header>
                    <obi-list gap='xs' margin='sm' style='max-height: 42vh' x2>
                        <list-item cmd-for='notifica in viewNotifiche' prepend='<obi-icon nome="mark_chat_unread"></obi-icon>' :descrizione='notifica.nome' relevance='secondary' :data-value='notifica.id' @click='openNotifica' interactable></list-item>
                    </obi-list>
                </obi-card>
            </div>
        </section>
    </float-container>`,
    options: {
        inputs: ["progetto"],
        dataset: {
            // hub: new ProgettiService(),
            apps: [],
            notifiche: [],
            current: null,
            ricerca: "",
            viewNotifiche: [],
        },
        computed: {
            logged: function () {
                return UserHandler.instance.logged;
            },
            prependDashboard: function () {
                return `<obi-icon nome='apps'></obi-icon>`;
            },
            prependNotifiche: function () {
                return this.notifiche.length ? `<obi-icon nome='notifications' style='overflow: visible'><obi-badge label='${this.notifiche.length}'></obi-badge></obi-icon>` : `<obi-icon nome='notifications'></obi-icon>`;
            },
            sottotitoloNotifiche: function () {
                return `NOTIFICHE`;
            },
        },
        actions: {
            async getApplications() {
                let user = UserHandler.instance.user?.id;
                if (user && user < 1000000) {
                    let url = `${API_URL}/obihub/api/utenti/${user}/progetti`;
                    let response = await fetch(url);
                    if (!response.ok) {
                        //obiAlert("Impossibile scaricare gli Applicativi OBI.", { type: "warning" });
                        console.error(response.statusText);
                        return;
                    }
                    let data = await response.json();
                    this.current = data.find(d => d.id == this.progetto);
                    this.apps = data?.filter(e => e.id != this.current?.id)
                        .sort((a, b) => b.idTipoApplicazione - a.idTipoApplicazione)
                        .map(p => ({ ...p, linkEsterni: p.linkEsterniJson ? JSON.parse(p.linkEsterniJson) : [] })) ?? [];
                    this.getNotifiche();
                }
            },
            async getNotifiche() {
                const user = UserHandler.instance.user;
                if (!user || !this.current) return;
                const url = `${API_URL}/OBIComunicazioni/api/notifiche/Riepilogo?user=${user?.id}&progetto=${this.current?.codice}`;
                let response = await fetch(url);
                if (!response.ok) {
                    obiAlert("Impossibile scaricare le notifiche.", { type: "warning" });
                    console.error(response.statusText);
                    return;
                }
                let riepilogo = await response.json();
                this.notifiche = riepilogo?.filter(n => n.progetto === this.current.codice) ?? [];
                this.updateViewNotifiche();
                for (let prog of this.apps) {
                    prog.hasNotifiche = riepilogo.some(n => n.progetto == prog.codice);
                }
                setTimeout(() => { this.getNotifiche(); }, 5 * 60 * 1000);
            },
            updateViewNotifiche() {
                this.viewNotifiche = this.notifiche.filter(n => {
                    if (n.visualizzata) return false;
                    return n.nome.toLowerCase().includes(this.ricerca.toLowerCase()) ||
                        n.codice.toLowerCase().includes(this.ricerca.toLowerCase()) ||
                        n.username.toLowerCase().includes(this.ricerca.toLowerCase()) ||
                        n.note.toLowerCase().includes(this.ricerca.toLowerCase());
                }).slice(0, 5);
            },
            openApp(evt) {
                let target = evt.currentTarget;
                let id = Number(target.getAttribute("data-value"));
                if (id && !isNaN(id)) {
                    const app = this.apps.find(a => a.id == id);
                    const installazione = app?.linkEsterni?.find(l => l.nome == "Produttivo")?.link;
                    if (app && installazione) {
                        switch (app.idTipoApplicazione) {
                            case 7:
                                if (app.versione.includes("U1")) {
                                    window.open(`${installazione}/Accesso/HubLogin/${UserHandler.instance.user?.codice}`, '_blank');
                                    break;
                                }
                            default:
                                window.open(installazione, '_blank');
                                break;
                        }
                    }
                }
            },
            async openNotifica(evt) {
                let target = evt.currentTarget;
                let id = Number(target.getAttribute("data-value"));
                if (id && !isNaN(id)) {
                    let notifica = this.notifiche.find(n => n.id == id);
                    if (notifica) {
                        this.notifiche = this.notifiche.map(n => n.id == id ? { ...n, visualizzata: true } : n);
                        await fetch(`${API_URL}/OBIComunicazioni/api/notifiche/visualizza?user=${notifica.idDestinatario}&codice=${notifica.codice}`, { method: "DELETE" });
                        location.href = notifica.link;
                    }
                }
            },
            getLogo(prj) {
                return prj.logo ? `<obi-logo :src='${prj.logo}'></obi-logo>` : "<obi-icon nome='grid_view'></obi-icon>";
            },
            async viewAll() {
                for (let notifica of this.notifiche) {
                    if (!notifica.visualizzata) {
                        const url = `${API_URL}/OBIComunicazioni/api/notifiche/visualizza?user=${notifica.idDestinatario}&codice=${notifica.codice}`;
                        await fetch(url, { method: "DELETE" });
                        notifica.visualizzata = true;
                    }
                }
                this.updateViewNotifiche();
            }
        },
        events: [
            {
                name: Collection.node_event.progress,
                action: async function (state) {
                    if (state == Collection.lifecycle.mounted) {
                        this.getApplications();
                        UserHandler.instance.onLogin(async () => { if (!this.apps.length) await this.getApplications(); });
                    }
                }
            },
        ],
    }
});