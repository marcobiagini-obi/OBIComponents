import { Collection } from "../LAMP/RenderModule/modules/enumerators.js";

export const clickRippleEvent = {
    name: Collection.node_event.render,
    action: (element) => {
        if (element) {
            let _buttons = element.nodeName == "BUTTON" || element.nodeName == "A" || element.nodeName == "LABEL" ? [element] : element.querySelectorAll("button, a");
            if (_buttons) {
                for (const btn of _buttons) {
                    if (!btn.rippleClick) {
                        btn.addEventListener("click", (evt) => {
                            buttonClickRipple(evt);
                        });
                        btn.rippleClick = true;
                    }
                }
            }
        }
    }
}
const theme_palette = [
    {
        name: "OBI",
        palette: [
            { name: "brand", color: "#FF7E21" },
            { name: "primary", color: "#69461E" },
            { name: "secondary", color: "#61574C" },
            { name: "tertiary", color: "#1A406B" },
        ]
    },
    {
        name: "Creatività", //#E3D8CD
        palette: [
            { name: "brand", color: "#B6997C" },
            { name: "primary", color: "#4E3D2C" },
            { name: "secondary", color: "#61574C" },
            { name: "tertiary", color: "#1A406B" },
        ]
    },

    {
        name: "Responsabilità", //#BFE1CC
        palette: [
            { name: "brand", color: "#66B785" },
            { name: "primary", color: "#1A3725" },
            { name: "secondary", color: "#4C6154" },
            { name: "tertiary", color: "#6B1A48" },
        ]
    },
    {
        name: "Collaborazione", //#14143F
        palette: [
            { name: "brand", color: "#6464CE" },
            { name: "primary", color: "#27277C" },
            { name: "secondary", color: "#4E4C61" },
            { name: "tertiary", color: "#6B2E1A" },
        ]
    },
    {
        name: "Crescita", //#531C3B
        palette: [
            { name: "brand", color: "#C2478D" },
            { name: "primary", color: "#3D142C" },
            { name: "secondary", color: "#614C58" },
            { name: "tertiary", color: "#3D6B1A" },
        ]
    }
]

export function toDate(val) {
    if (typeof val !== "string" || !val.trim()) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? val : d;
}
export function buttonClickRipple(evt) {
    const button = evt.currentTarget;
    let circle = button.querySelector(".ripple");
    if (circle) circle.remove();
    circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${evt.clientX - rect.left - radius}px`;
    circle.style.top = `${evt.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];

    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
    window.setTimeout(() => { circle.remove(); }, 700);
}
export function getPalette(name) {
    let _set = theme_palette.find(p => p.name == name);
    return _set ? _set.palette : null;
}
export function getIcon(type) {
    switch (type) {
        case "image/gif":
        case "image/jpeg":
        case "image/png":
            return "image";
        case "application/pdf":
            return "picture_as_pdf";
        case "text/csv":
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "application/vnd.ms-excel":
            return "dataset";
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword":
            return "description";
        case "application/x-msdownload":
        case "application/x-apple-diskimage":
        case "application/octet-stream":
        case "application/vnd.android.package-archive":
        case "application/x-apple-diskimage":
        case "application/java-archive":
            return "terminal";
        case "archive/x-tar":
        case "archive/zip":
        case "archive/x-iso9660-image":
        case "archive/x-7z-compressed":
        case "archive/x-rar-compressed":
        case "archive/gzip":
        case "archive/x-bzip2":
            return "archive";
        case "audio/aac":
        case "audio/flac":
        case "audio/mpeg":
        case "audio/mp4":
        case "audio/wav":
        case "audio/x-ms-wma":
            return "mic";
        case "video/avi":
        case "video/mp4":
        case "video/webm":
        case "video/avchd":
        case "video/x-flv":
        case "video/quicktime":
        case "video/x-ms-wmv":
        case "video/x-matroska":
            return "movie";
        case "text/plain":
            return "notes";
        case "text/html":
            return "link";
        default: return "draft";
    }
}
export function checkHtmlWhitelist(html, whitelist) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const allElements = doc.body.querySelectorAll('*');

    for (const el of allElements) {
        if (!whitelist.includes(el.tagName.toLowerCase())) {
            return false;
        }
    }
    return true;
}

/**
 * Invia una email di assistenza
 *
 * @export
 * @param {*} subject
 * @param {*} body
 * @param {string} [receiver="assistenza-it@obi-italia.it"]
 */
export function sendEmailToAssistenza(rawSubject, rawBody, receiver = "assistenza-it@obi-italia.it") {
    let subject = rawSubject;
    let body = rawBody;
    try {
        if (rawSubject) subject = encodeURIComponent(rawSubject);
        if (rawBody) body = encodeURIComponent(rawBody);

        // 4. Construct the final URL
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${receiver}&su=${subject}&body=${body}`;

        // Open it
        window.open(gmailUrl, '_blank');
    } catch (ex) {
        throw ex;
    }
}
/**
 * Elabora un indirizzo url che apre una pagina Google Maps con un percorso già impostato dall'indirizzo di partenza a quello di destinazione
 *
 * @export
 * @param {*} start {indirizzo: string, citta: string, provincia: string, cap: string}
 * @param {*} destination {indirizzo: string, citta: string, provincia: string, cap: string}
 * @returns {string}
 */
export function elaborateMapsUrl(start, destination) {
    let indirizzo1 = addressToUri(start);
    let indirizzo2 = addressToUri(destination);

    return `https://www.google.com/maps/dir/${indirizzo1}/${indirizzo2}`;

    function addressToUri(address) {
        return `${encodeURI(address.indirizzo)},+${address.cap}+${encodeURI(address.citta)}+${address.provincia}`;
    }
}
export function fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    console.log("Fallback: Text copied to clipboard!");
}
export async function getEncryptedUrl(baseUrl, queryString, rawKey, rawIv) {
    const encoder = new TextEncoder();
    const data = encoder.encode(queryString);

    // Import the raw key into a format the browser can use
    const key = await window.crypto.subtle.importKey("raw", encoder.encode(rawKey), "AES-CBC", false, ["encrypt"]);

    // Encrypt
    const encryptedBuffer = await window.crypto.subtle.encrypt({ name: "AES-CBC", iv: encoder.encode(rawIv) }, key, data);

    // Convert to Base64 and make it URL-safe
    const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
    const base64 = btoa(String.fromCharCode.apply(null, encryptedArray));

    return `${baseUrl}?data=${encodeURIComponent(base64)}`;
}
/** 
 * Estrapola il messaggio di errore da una response HTTP, gestendo sia errori JSON che non-JSON, e restituendo un messaggio user-friendly.
 * @export
 * @async
 * @param {*} response 
 * @returns {unknown} 
 */
export async function handleResponseError(response) {
    let details = null;
    try {
        details = await response.json();
    } catch (e) {
        details = response.cause ?? { message: "Non-JSON response" };
    }

    // --- LOGGING FOR DEVELOPER (CONSOLE) ---

    const status = response.status ?? 400;

    console.group(`--- API ERROR: ${status} ---`);
    console.error(`URL: ${response.url}`);
    console.error("Full Payload:", details);
    console.groupEnd();

    // --- MESSAGE FOR USER ---
    let userMessage = "Si è verificato un errore imprevisto.";

    if (response.status === 400 && details) {
        // Extract the first error from ModelState
        // ModelState structure: { "FieldName": ["Error 1", "Error 2"] }
        const modelState = response.modelState ?? details.cause?.response?.modelState ?? details;
        const firstKey = Object.keys(modelState)[0];

        if (firstKey && Array.isArray(modelState[firstKey])) {
            userMessage = modelState[firstKey][0];
        } else if (typeof details === 'string') {
            userMessage = details;
        }
    } else if (response.status >= 500) {
        userMessage = "Errore del server. Per favore, riprova più tardi.";
    }

    return userMessage;
}