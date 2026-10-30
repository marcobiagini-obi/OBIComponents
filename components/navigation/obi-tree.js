import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import log from "../../LAMP/RenderModule/modules/console.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";
import { Support } from "../../LAMP/RenderModule/modules/library.js";

const icons = {
    toexpand: "expand_more",
    tocollapse: "expand_less",
}

// defineComponent({
//     selector: "obi-tree",
//     template:
//         `<div tree-item :root="isRoot" :leaf="isLeaf" :state='$.nodo && $.nodo.state' :expanded='expanded'>
//             <a tree-header @click='clickNode'>
//                 <obi-icon cmd-if='$.nodo && $.nodo.icona' :nome='nodo.icona'></obi-icon>
//                 <label>{{$.nodo?.label ? $.nodo.label : ""}}</label>
//                 <obi-icon cmd-if='$.nodo && $.nodo.state' :nome='state_icon' :relevance='$.nodo.state'></obi-icon>
//                 <obi-icon cmd-if='!$.isLeaf' :nome='expanded_icon'></obi-icon>
//             </a>
//             <div tree-children cmd-if='!$.isLeaf'>
//                 <obi-tree cmd-for='child in nodo.children' :nodo='child' :nparent='nodo' :nid=':index + $.nid'></obi-tree>
//             </div>
//         </div>`,
//     options: {
//         inputs: ["nodo", "nparent", "nid"],
//         dataset: {
//             nodo: {
//                 icona: null,
//                 label: " - ",
//                 children: [],
//                 action: null,
//                 state: "",
//             },
//             nparent: null,
//             expanded: false,
//             nid: "0",
//         },
//         computed: {
//             expandedByDefault: function () {
//                 if (this.isRoot) {
//                     return this.__node.backup.hasAttribute("expanded");
//                 } else {
//                     return this.root_element?.virtual?.context.expandedByDefault || false;
//                 }
//             },
//             isLeaf: function () {
//                 return !("children" in this.nodo) || this.nodo.children.length == 0;
//             },
//             isRoot: function () {
//                 return this.nparent == null;
//             },
//             state_icon: function () {
//                 switch (this.nodo?.state) {
//                     case "success":
//                         return "check";
//                     case "warning":
//                         return "notifications";
//                     case "danger":
//                         return "close";
//                 }
//                 return "";
//             },
//             root_element: function () {
//                 return this.isRoot ? this.__element : this.__element?.closest("[root]");
//             },
//             expanded_icon: function () { return this.expanded ? "expand_less" : "expand_more"; },
//         },
//         actions: {
//             clickNode: function (evt) {
//                 this.toggle();
//                 if (!this.__element?.hasAttribute("active")) this.activate();
//                 if (this.isLeaf) this.root_element?.virtual.parent.trigger("leafclick", this);
//                 if (this.isRoot) this.root_element?.virtual.parent.trigger("rootclick", this);
//                 this.root_element?.virtual.parent.trigger("action", this);
//                 if (this.nodo.action) this.nodo.action(this.root_element?.virtual?.context || this);
//             },
//             expand() {
//                 this.expanded = true;
//             },
//             close() {
//                 this.expanded = false;
//             },
//             toggle() {
//                 this.expanded = !this.expanded;
//             },
//             activate() {
//                 let _root = this.root_element.virtual;
//                 deactivateAll(_root);
//                 this.__element?.setAttribute("active", "");

//                 function deactivateAll(node) {
//                     node.reference[0].removeAttribute("active");
//                     let _children = node.reference[0]?.children[1]?.children || [];
//                     for (var child of _children) {
//                         deactivateAll(child.virtual);
//                     }
//                 }
//             }
//         },
//         events: [
//             {
//                 name: "progress",
//                 action: function (state) {
//                     // if (state == Collection.lifecycle.context_created) {
//                     //     if (this.isActive) {
//                     //         this.activateNode();
//                     //     }
//                     // }
//                     if (state == Collection.lifecycle.mounted && this.__element) {
//                         this.expanded = this.expandedByDefault;
//                     }
//                     // if (state == Collection.lifecycle.ready && this.__element) {
//                     //     if (this.isActive) {
//                     //         expandTreeParents(this.__node.parent);
//                     //     }
//                     //     function expandTreeParents(node) {
//                     //         if (node && !node.context.isLeaf) {
//                     //             node.context.expanded = true;
//                     //         }
//                     //         if (node && !node.context.isRoot) {
//                     //             expandTreeParents(node.parent);
//                     //         }
//                     //     }
//                     // }
//                 }
//             }
//         ]
//     }
// });

const tree_template = `<div tree-item {{type}} {{active}} :value='nodeid' :data-value='nodevalue'>
            <a tree-header>
                <obi-icon cmd-if='prepend' :nome="prepend"></obi-icon>
                <label>{{label}}</label>
                <obi-icon cmd-if='append' :nome="append"></obi-icon>
            </a>
            <div cmd-if='children' tree-children cmd-model='children'></div>
        </div>`

defineComponent({
    selector: "obi-tree",
    template: `<div></div>`,
    options: {
        inputs: ["data", "mode"],
        dataset: {
            data: {
                label: "",
            },
            children: "",
            hashmap: {}
        },
        computed: {
            prepend: function () {
                return data ? data.prepend : "";
            },
            append: function () {
                return data ? data.append : "";
            },
            label: function () {
                return data ? data.label : "";
            },
            type: function () {
                return data && data.type ? data.type : "";
            },
            active: function () {
                return data && data.active ? "active" : "";
            },
        },
        actions: {
            elaborateTemplate: function () {
                this.hashmap = {};
                return getNodeTemplate.call(this, this.data, true);
                function getNodeTemplate(node, isRoot = false) {
                    let id = Support.uniqueID();
                    this.hashmap[id] = node;
                    var children = "";
                    let type = !node.children || !node.children.length ? "leaf" : isRoot ? "root" : "node";
                    if (node.children && Array.isArray(node.children)) {
                        for (const child of node.children) {
                            children += getNodeTemplate.call(this, child);
                        }
                    }
                    return tree_template
                        .replace("{{type}}", node.type || type)
                        .replace("{{active}}", node.active ? "active" : "")
                        .replace(":value='nodeid'", `value='${id}'`)
                        .replace(":data-value='nodevalue'", node.value ? `data-value='${node.value}'` : "")
                        .replace(`<obi-icon cmd-if='prepend' :nome="prepend"></obi-icon>`, node.prepend ? `<span obi-icon class='material-symbols-outlined'>${node.prepend}</span>` : "")
                        .replace(`<obi-icon cmd-if='append' :nome="append"></obi-icon>`, node.append ? `<span obi-icon class='material-symbols-outlined'>${node.append}</span>` : "")
                        .replace("{{label}}", node.label)
                        .replace(`<div cmd-if='children' tree-children cmd-model='children'></div>`, children ? `<div tree-children>${children}</div>` : "");
                }
            },
            update() {
                this.__node.incubator.textContent = "";
                this.__node.incubator.appendChild(Support.templateFromString(this.elaborateTemplate())?.firstChild);
                this.__node.replaceNodes();
                let _node = this;
                let nodes = this.__node.reference[0].querySelectorAll("a[tree-header]");
                nodes.forEach(item => item.addEventListener("click", (evt) => { _node.nodeAction(evt); }));
            },
            nodeAction(evt) {
                var target = evt.currentTarget.parentNode;
                let node = this.hashmap[target.getAttribute("value")];
                if ("action" in node && typeof node.action === "function") node.action.call(node, this);
                this.__node.trigger("nodeclick", { evt: evt, data: node });
                this.openNode(target);
            },
            openNode(target) {
                this.__node.reference[0].removeAttribute("current");
                this.__node.reference[0].querySelectorAll("div[tree-item]").forEach(item => {
                    item.removeAttribute("current");
                    item.removeAttribute("blur");
                    if (item.hasAttribute("leaf")) item.removeAttribute("active");
                });
                target.setAttribute("current", "");
                switch (this.mode) {
                    case "single":
                        this.__node.reference[0].querySelectorAll("div[tree-item]").forEach(item => item.removeAttribute("active"));
                        while (target != null) {
                            target.setAttribute("active", "");
                            target = target.parentNode.closest("div[tree-item]");
                        }
                        break;
                    case "active":
                        if (target.hasAttribute("leaf")) {
                            let parent = target.parentNode.closest("div[tree-item]");
                            parent.querySelectorAll("div[tree-item]").forEach(item => item.removeAttribute("active"));
                            target.setAttribute("active", "");
                        } else {
                            target.setAttribute("active", "");
                            target.querySelectorAll("div[tree-item][active]").forEach(item => item.removeAttribute("active"));
                        }
                        break;
                    case "open":
                        this.__node.reference[0].setAttribute("active", "");
                        this.__node.reference[0].querySelectorAll("div[tree-item][node]").forEach(item => {
                            item.setAttribute("active", "");
                        });
                        target.setAttribute("active", "");
                        break;
                    default:
                        if (target.hasAttribute("leaf")) {
                            let parent = target.parentNode.closest("div[tree-item]");
                            parent.querySelectorAll("div[tree-item]").forEach(item => item.removeAttribute("active"));
                            target.setAttribute("active", "");
                        } else {
                            if (target.hasAttribute("active")) target.removeAttribute("active"); else target.setAttribute("active", "");
                        }
                        break;
                }
                this.__node.reference[0].querySelectorAll("div[tree-item][active]").forEach(item => {
                    if (!item.hasAttribute("current") &&
                        item.hasAttribute("node") &&
                        !item.closest("div[tree-item][current]") &&
                        item.querySelector("div[tree-item][current]") == null) item.setAttribute("blur", "");
                });
            },
        },
        events: [
            {
                name: Collection.node_event.progress,
                action: function (state) {
                    if (state == Collection.lifecycle.mounted) {
                        this.update();
                    }
                }
            }
        ]
    }
})


defineComponent({
    selector: "obi-tree-component",
    template:
        `<test-template name='OBI TREE NAVIGATION' :description='descrizione' :code='code' :data='treedata'>
            <section actions slot='actions'>
                <obi-select :valore='mode' :opzioni='modes' label='Modalità'></obi-select>
            </section>
        </test-template>`,
    options: {
        dataset: {
            modes: [
                { label: "Default", value: "" },
                { label: "Dinamico", value: "active" },
                { label: "Singola Voce", value: "single" },
                { label: "Tutto Aperto", value: "open" },
            ],
            mode: "",
            treedata: {
                label: "Colazione",
                prepend: "bakery_dining",
                children: [
                    {
                        label: "cappuccino",
                        children: [
                            {
                                label: "latte",
                                action: function () { alert(this.label); }
                            },
                            {
                                label: "caffé",
                                action: function () { alert(this.label); }
                            }
                        ]
                    },
                    {
                        label: "toast",
                        state: "success",
                        children: [
                            { label: "bread" },
                            { label: "egg" },
                            { label: "cheese" },
                            { label: "ham" },
                        ],
                    }
                ]
            },
            descrizione: `La navigazione ad albero consente di renderizzare sottomenù verticali partendo da un oggetto JSON contente i seguenti parametri:
                - label: il testo della voce di menù
                - prepend: l'icona della voce di manù
                - append: l'icona in coda alla voce di manù
                - action: l'azione da eseguire al click sull'intestazione
                - children: la lista di oggetti JSON imparentati con l'attuale`,
            single: false,
        },
        computed: {
            code: function () {
                return "<obi-tree :data='data'" + (this.mode ? ` mode='${this.mode}'` : "") + "></obi-tree>"
            }
        },
    }
});