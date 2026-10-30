
export default {
    id: "docs.lampredotto.render.utility",
    nome: "RenderModule - Utilità",
    sezioni: [
        {
            titolo: "",
            note: ``,
            descrizione: `KEYWORDS`,
            codice: `.
__node: fa riferimento al nodo virtuale,
__element: fa riferimento al primo elemento html legato al nodo virtuale,
__app: permette l'accesso all'applicazione che contiene il nodo virtuale,
__storage: permette l'accesso alle proprietà non legate dinamicamente all'interfaccia,
                           . `,
        },
        {
            titolo: "",
            note: ``,
            descrizione: `Funzioni di utilità all'interno dei nodi virtuali`,
            codice: `.
//LIFECYCLE
    update() -> esegue l'aggiornametno del contesto e della renderizzazione del nodo virtuale,
    render() -> aggiorna il render del nodo virtuale,
    dismiss() -> rimuove i riferimenti html e il nodo virtuale stesso dalla virtualizzazione dell'applicazione,

//DATA
    async elaborateContext(context) -> aggiorna il contesto dei dati del nodo virtuale,
    updateSettings(settings) -> aggiorna le impostazioni,

//EVENTS
    on(name, action) -> imposta un evento al nodo virtuale
    trigger(name, ...args) -> esegue l'azione legata ad un evento precedentemente registrato.

//DOM REFERENCES
    append(node, index = 0) -> Inserisce un nuovo nodo come ultimo elemento tra i figli,
    prepend(node, index = 0) -> Inserisce un nuovo nodo come primo elemento tra i figli,
    replaceWith(node) -> sostituisce il primo elemento di riferimento del nodo virtuale con un altro,
    replaceHtmlContent(template) -> sostituisce il contenuto html del riferimento con un nuovo contenuto html definito da un template,
    hasAttribute(attribute) -> controlla che il nodo contenda un attributo specifico,
    removeChildren(filter) -> rimuove i figli del nodo in base a un filtro che è una funzione con input vnode che restituisce true o false,
    replaceChild(vnode) -> sostituisce un figlio con un altro in base all'id,
    childOf(query: { attribute: string, nodeName: string, className: string }) -> controlla che il nodo sia figlio di un nodo specifico,
    getParent(query) -> restituisce il primo padre che rispetta le condizioni di query,
    getChild(query) -> restituisce il primo figlio che rispetta le condizioni di query,
    getChildContext(query) -> restituisce il contesto dati del primo figlio che rispetta le condizioni di query,
    .`,
        },
        {
            titolo: "",
            note: ``,
            descrizione: `Lista degli enumeratori della Collection di Lampredotto JS`,
            codice: `.
import Collection from \"${BASE_URL}/LAMP/RenderModule/modules/enumerators.js\";

Collection.lifecycle.initialized
Collection.lifecycle.setup
Collection.lifecycle.creating
Collection.lifecycle.created
Collection.lifecycle.mounting
Collection.lifecycle.mounted
Collection.lifecycle.updating
Collection.lifecycle.updated
Collection.lifecycle.unmounting
Collection.lifecycle.unmounted
Collection.lifecycle.error
Collection.lifecycle.server
Collection.lifecycle.context_creating
Collection.lifecycle.context_created
Collection.lifecycle.ready

Collection.application_event.progress
Collection.application_event.update
Collection.application_event.setup
Collection.application_event.render
Collection.application_event.component

Collection.node_event.progress
Collection.node_event.change
Collection.node_event.setup
Collection.node_event.render
Collection.node_event.inject
Collection.node_event.virtualized
Collection.node_event.dataset

Collection.message_type.log
Collection.message_type.success
Collection.message_type.warning
Collection.message_type.error
Collection.message_type.server_log
Collection.message_type.server_error
Collection.message_type.server_success
Collection.message_type.debug

Collection.debug_mode.all
Collection.debug_mode.message
Collection.debug_mode.commands

Collection.KeyWords.node
Collection.KeyWords.app
Collection.KeyWords.element

                        .`,
        },
    ]
}