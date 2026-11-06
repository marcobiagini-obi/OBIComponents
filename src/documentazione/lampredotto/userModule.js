import { BASE_URL } from "../../../obi.config.js";

export default
    {
        id: "docs.lampredotto.user",
        nome: "Modulo Gestione Utenti",
        sezioni: [
            {
                titolo: "Introduzione a User Module",
                note: `Il <strong>Modulo Utenti</strong> consente di gestire i dati dell'utente e i suoi cookies in locale.
                
                Il sistema è basato su eventi e si interfaccia ai metodi di accesso dell'applicazione tramite i le funzioni <code>onLogin()</code> e <code>onLogout()</code>
                All'interno della memoria <mark>LocalStorage</mark> vengono salvate le preferenze grafiche dell'utente ed opzionalmente la storia di navigazione (da implementare). Mentre nella memoria <mark>SessionStorage</mark> vengono memorizzati i dati dell'utente scaricati dal server.
                Questi ultimi vengono mantenuti fintanto che l'utente mantiene il tab dell'applicazione aperto e possono essere recuperati con la funzione <code>getSessionUser()</code>
                `,
                descrizione: `Effettuare il Login`,
                codice: `
import UserHandler from "${BASE_URL}/LAMP/UserModule/LampAccess.js";

function login(username, password){
    //eseguo la connessione al server per validare l'accesso.
    var user = metodoDiLogin(username, password);
    if (user != null) {
        //Se l'utente ha effettuato correttamente l'accesso si registra con UserHandler
        //Parametri della funzione
        // - identificatico (solitamente l'username per mantenere le impostazioni su tutti i portali supportati)
        // - dati dell'utente
        // - impostazioni grafiche di default [opzionale]
        UserHandler.instance.login(user.username, user, { darkmode: false });
    } else {
        messaggioLoginFallito();
    }
}
    `,
            },
            {
                descrizione: "Impostare il Logout",
                codice: ` 
 //Imposto l'azione di logout nell'evento relativo di UserHandler
UserHandler.instance.onLogout(() => { metodoDiLogout(); });


function logout(){
    //Questa funzione richiama l'evento di logout
    UserHandler.instance.logout();
}`,
            },
            {
                titolo: "Login Tramite Sessione",
                note: `Nella progettazione di un progetto è facile che ci sia la necessità di impostare più <mark>caricamenti di pagina</mark> dovendo mantenere l'accesso dell'utente.
                Per evitare la <mark>disconnessione dell'utente</mark> ad ogni aggiornamento è possibile impostare il recupero dei dati dalla memoria di sessione.
                
                Il metodo <code>sessionLogin</code> di <strong>UserHandler</strong> recupera l'utente in sessione al caricamento di ogni pagina`,
                descrizione: "Recupero Utente dalla SessionStorage",
                codice: ` //Inserire questo metodo all'inizio dello script
UserHandler.instance.sessionLogin();

function isUserLogged(){
    return UserHandler.instance.logged;
}
                `,
            },
            {
                descrizione: "Altre Proprietà utili di UserHandler",
                codice: `
 //Per controllare se l'utente ha effettuato il login
UserHandler.instance.logged;

//Restituisce i dati dell'utente loggato
UserHandler.instance.user;

//Restituisce le impostazioni grafiche preferite dell'utente
UserHandler.instance.settings;

//Imposta un'azione sull'evento di errore
onError();

//Salva i dati dell'utente nel localStorage
saveUser();

//Aggiorna i dati dell'utente salvati nel sessionStorage
setSessionUser();
                `,
            }
        ]
    }