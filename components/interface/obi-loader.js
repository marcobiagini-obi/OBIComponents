import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";
import { vNode } from "../../LAMP/RenderModule/modules/virtualizer.js";

let loaderTemplate = {
    default: `<span square></span>`,
    button: `<span cell></span>`,
    table: `<span row></span><span rectangle></span>`,
    input: `<span row></span>`,
    list: `<span cell></span><span row='3'></span><span cell></span><span row='3'></span><span cell></span><span row='3'></span>`,
}

defineComponent({
    selector: "obi-loader",
    template: '<div skeleton-loader></div>',
    options: {
        action: {
            remove() {
                this.__node.dismiss();
            }
        },
        events: [
            {
                name: Collection.node_event.render,
                action: function () {
                    let template = loaderTemplate[this.__element.getAttribute("type") || "default"];
                    this.__element.insertAdjacentHTML("afterbegin", template);
                }
            }
        ]
    }
});

/**
 * Attach the skeleton loader to the component until the async operation isn't completed
 *
 * @export
 * @param {*} action
 * @param {...{}} vnodes
 */
export default async function loader(action, ...vnodes) {
    const process = {
        stillRunning: true,
    }
    for (const item of vnodes) {
        if (item != null) {
            if (isSkeleton(item)) {
                let element = getElement(item.target);
                element?.setAttribute("disabled", "disabled");
                element?.insertAdjacentHTML("afterbegin", `<div skeleton-loader>${loaderTemplate[item.type || "default"]}</div>`);
            } else {
                loadingAnimation(getElement(item), process);
            }
        }
    }
    let res;
    try {
        res = await Promise.resolve(action());
    } finally {
        process.stillRunning = false;
        for (const item of vnodes) {
            if (item != null) {
                if (isSkeleton(item)) {
                    let element = getElement(item.target);
                    element?.querySelector("[skeleton-loader]")?.remove();
                    element?.removeAttribute("disabled");
                } else {
                    let element = getElement(item);
                    if (typeof element?.setAttribute === "function") element.setAttribute("loading", "100");
                    sleep(100).then(() => { if (typeof element?.removeAttribute === "function") element?.removeAttribute("loading"); });
                }
            }
        }
    }
    return res;

    function getElement(item) {
        return item instanceof vNode ?
            item.firstChild :
            ("virtual" in item ? item.virtual.firstChild : item);
    }

    async function loadingAnimation(node, process) {
        let i = 0;

        while (i < 90 && process.stillRunning) {
            await sleep(10).then(() => { node.setAttribute("loading", i++); });
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function isSkeleton(object) {
        return typeof object == "object" && "target" in object && "type" in object;
    }
}