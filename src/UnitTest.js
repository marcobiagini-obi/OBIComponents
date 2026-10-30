export default async function runTest(name, action, assert) {
    const tool = document.getElementById("unit_test");
    if (tool == undefined) {
        tool = document.createElement("section");
        tool.setAttribute("id", "unit_test");
        document.body.insertAdjacentElement("afterbegin", tool);
    }

    action().then((res) => {
        console.log(res);
        if (assert(res)) {
            tool.insertAdjacentHTML('beforeend', success(`Test ${name} Completato`));
        } else {
            tool.insertAdjacentHTML('beforeend', error(`Test ${name} Senza risultato`));
        }
    }).catch((ex) => {
        console.error(ex);
        tool.insertAdjacentHTML('beforeend', error(`Test ${name} In Errore: ${ex.message}`));
    });

    function success(message) {
        return `<div class='test-item success'><span class="material-symbols-outlined">check_circle</span> ${message}</div>`;
    }
    function error(message) {
        return `<div class='test-item error'><span class="material-symbols-outlined">cancel</span> ${message}</div>`;
    }
}