/**Controlla se è presente un utente in sessione ed imposta username e password nel form dedicato al login. 
 * Restituisce un Promise<boolean> con true se vengono compilati i campi e false se non viene trovato alcun utente.*/
async function fastLogin(input_username, input_password) {
    let hubSession = JSON.parse(sessionStorage.getItem("active_user"));
    if (hubSession && hubSession.data) {
        let hub_user = hubSession.data;
        if (hub_user) {
            input_username.value = hub_user.Username;
            input_password.value = hub_user.Password;
            return true;
        }
    }
    return false;
}
const logoutEventKey = "ssoLogout";
const logoutEvent = new CustomEvent(logoutEventKey);
/**Richiama l'evento di logout del sso sull'attuale contenitore o eventualmente su un contenitore specifico. */
function triggerLogout(element = null) {
    if (element)
        element.dispatchEvent(logoutEvent);
    else
        window.dispatchEvent(logoutEvent);
}
/**Imposta l'evento di logout del sso, riceve un'azione da compiere ed eventualmente il contenitore dove eseguirla. */
function onLogout(action, element = null) {
    if (element)
        element.addEventListener(logoutEventKey, (evt) => { action(evt); }, false)
    else
        window.addEventListener(logoutEventKey, (evt) => { action(evt); }, false);
}

