import UserHandler from "../../LAMP/UserModule/LampAccess.js";
import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";
import { checkHtmlWhitelist } from "../../src/support.js";
import { loadApi, obiAlert } from "../../core.js";
import { API_URL, BASE_URL } from "../../obi.config.js";

const cmdMap = { bold: 'bold', italic: 'italic', underlined: 'underline', crossed: 'strikeThrough' };
const tagMap = { bold: 'STRONG', italic: 'EM', underlined: 'U', crossed: "S" };

var selectionTextMode = [];
const innerTextCommands = ["mailto"];

defineComponent(
	{
		selector: "obi-textarea",
		template:
			`<div obi-textarea :required='required' :invalid='!$.isValidContent'>
				<div display-row='wrap' gap='sm' cmd-if='isFormattable'>
					<group-component text-format style='justify-content: flex-start;' cmd-if='!$.isDisabled'>
						<obi-button :relevance='$.isBold ? "primary" : null' @click='setTextModes' style='width: 20px; height: 20px; min-height: unset;' title='Bold' padding-side='md'><b>B</b></obi-button>
						<obi-button :relevance='$.isItalic ? "primary" : null' @click='setTextModes' style='width: 20px; height: 20px; min-height: unset;' title='Italic' padding-side='md'><i>i</i></obi-button>
						<obi-button :relevance='$.isUnderlined ? "primary" : null' @click='setTextModes' style='width: 20px; height: 20px; min-height: unset;' title='Underlined' padding-side='md'><u>S</u></obi-button>
						<obi-button :relevance='$.isCrossed ? "primary" : null' @click='setTextModes' style='width: 20px; height: 20px; min-height: unset;' title='Crossed' padding-side='md'><s>T</s></obi-button>
					</group-component>
					<div display-row style='justify-content: flex-start;' cmd-if='!$.isDisabled'>
						<obi-button @click='setList' style='width: 20px; height: 20px; min-height: unset;' title='List' padding-side='md'><span class='material-symbols-outlined' style='font-size: 20px;'>format_list_bulleted</span></obi-button>
						<obi-button @click='setNumericList' style='width: 20px; height: 20px; min-height: unset;' title='Numeric List' padding-side='md'><span class='material-symbols-outlined' style='font-size: 20px;'>format_list_numbered</span></obi-button>
						<obi-button @click='setCheckList' style='width: 20px; height: 20px; min-height: unset;' title='Check list' padding-side='md'><span class='material-symbols-outlined' style='font-size: 20px;'>check_box_outline_blank</span></obi-button>
					</div>
				</div>
	    		<div text-input @click='focusContentEditable' >
					<div :hidden='isDisabled' contenteditable='true' cmd-model='valore' @input='triggerChange' @keydown='textFormat' @mouseup='onMouseUp' class='new-line':empty='emptyValue' @modelupdate='setupCheckboxEvents'></div>
					<div cmd-if='isDisabled' cmd-model='valore' style='margin: 20px 16px 9px 16px'></div>
					<span cmd-if='emptyValue' placeholder>{{placeholder}}</span>
		    		<label for='input' cmd-if='label'>{{label}}</label> 
		    		<div text-indicator></div>
	    		</div> 
	    		<div text-support> 
		    		<span message cmd-if='$.messaggio' class='txt-body2'>{{messaggio}}</span> 
		    		<span counter cmd-if='$.counter'>{{counter}}</span> 
	    		</div>
    		</div>`,
		options: {
			inputs: ["label", "valore", "messaggio", "placeholder", "righe"],
			dataset: {
				valore: "",
				type: "text",
				righe: 5,
				invalid: false,
				isValidContent: true,
				textmodes: [],
				textSelected: false,
				commands: [],
			},
			storage: {
				selectionTextMode: [],
			},
			computed: {
				value: function () {
					return !this.emptyValue && !isNaN(this.valore) ? Number(this.valore) : this.valore;
				},
				content: function () {
					return !this.emptyValue ? this.valore == this.placeholder || "" : "";
				},
				required: function () {
					return this.__element.getAttribute("required") != null;
				},
				inputElement: function () { return this.__element.querySelector("[contenteditable]"); },
				isDisabled: function () { return this.__element.getAttribute("disabled") != null; },
				emptyValue: function () {
					let _value = this.inputElement?.textContent.replace(/\n/g, "");
					return _value.length === 0;
				},
				isFormattable: function () { return this.__element.getAttribute("enable-format") != null; },
				isBold: function () { return this.textmodes.includes("bold") || selectionTextMode.includes("bold"); },
				isItalic: function () { return this.textmodes.includes("italic") || selectionTextMode.includes("italic"); },
				isUnderlined: function () { return this.textmodes.includes("underlined") || selectionTextMode.includes("underlined"); },
				isCrossed: function () { return this.textmodes.includes("crossed") || selectionTextMode.includes("crossed"); },
				currentUser: function () { return UserHandler.instance.user; },
			},
			actions: {
				triggerChange() {
					this.isValid();
					// Highlight inline commands (like #mailto:...) at the start of the content
					this.__node.trigger("changed", this.valore);
				},
				focusContentEditable(evt) {
					const editable = this.__element.querySelector("[contenteditable]");
					if (editable && evt.target !== editable) {
						editable.focus();
					}

					// Check if there's a span[caretReference] and focus it
					const caretRef = editable.querySelector('span[caretReference]');
					if (caretRef) {
						const range = document.createRange();
						const selection = window.getSelection();
						range.setStart(caretRef, 0);
						range.collapse(true);
						selection.removeAllRanges();
						selection.addRange(range);
					}

					this.detectTextFormat();
				},
				isValid() {
					if (this.invalid) { isValidContent = false; return false; }
					if (this.value != null) {
						if (this.count && this.value.length > this.count) {
							this.isValidContent = false;
							return false;
						}
						this.isValidContent = checkValue(this.__element.getAttribute("format"), this.valore);
						return this.isValidContent;
					}
					return null;
					function checkValue(check, value) {
						if (!checkHtmlWhitelist(value, ['STRONG', 'EM', 'U', 'S', 'UL', 'OL', 'LI', 'BR', 'DIV', 'P', '#text'])) return false;
						if (check) {
							switch (check) {
								case "email":
									return Collection.regexp.mail.test(value);
								case "multiemail":
									return Collection.regexp.multiplemail.test(value);
								case "numeric":
									return Collection.regexp.numeric.test(value);
								case "textual":
									return Collection.regexp.textual.test(value);
								case "date":
									return Collection.regexp.dateformat.test(value);
							}
						}
						return true;
					}
				},
				setTextModes(evt, mode = "") {
					if (!mode) mode = (evt && evt.currentTarget && evt.currentTarget.title) ? evt.currentTarget.title.toLowerCase() : mode;
					if (!this.inputElement) return;
					// Focus contenteditable element
					this.inputElement.focus();
					const cmd = cmdMap[mode];
					const selection = window.getSelection();
					if (!this.inputElement.contains(selection.anchorNode)) return;

					// Toggle formatting on the selected text using execCommand for robust behavior
					const wasActive = document.queryCommandState(cmd);
					document.execCommand(cmd);

					if (selection && selection.rangeCount > 0 && selection.toString()) this.detectTextFormat();
					else {
						if (this.textmodes.includes(mode)) {
							this.textmodes.splice(this.textmodes.indexOf(mode), 1);
							if (this.__storage.selectionTextMode.includes(mode))
								this.__storage.selectionTextMode.splice(this.__storage.selectionTextMode.indexOf(mode), 1);
						} else {
							this.textmodes.push(mode);
							//applyFormattingTag(selection, this.textmodes);
						}
					}
				},
				textFormat(evt) {
					if (evt.ctrlKey && evt.key === 'b') {
						evt.preventDefault();
						this.setTextModes(evt, "bold");
					} else if (evt.ctrlKey && evt.key === 'i') {
						evt.preventDefault();
						this.setTextModes(evt, "italic");
					} else if (evt.ctrlKey && evt.key === 'u') {
						evt.preventDefault();
						this.setTextModes(evt, "underlined");
					} else if (evt.ctrlKey && evt.key === 's') {
						evt.preventDefault();
						this.setTextModes(evt, "crossed");
					} else if (evt.key === ' ') {
						selectionTextMode = [];
						this.updateFormatButtonsManually();
						// setTimeout(() => this.highlightInlineCommands(), 0);
					} else if (evt.key === 'delete' || evt.key === 'Backspace') {
						if (this.inputElement.textContent.replace(/\n/g, "").length === 0) {
							selectionTextMode = [];
							this.textmodes = [];
							this.updateFormatButtonsManually();
							this.inputElement.innerHTML = "";
							this.inputElement.dispatchEvent(new Event("input", { bubbles: true }));
						}
						// else {
						// 	setTimeout(() => this.highlightInlineCommands(), 0);
						// }
					} else if (evt.key === "Enter" && !evt.shiftKey) {
						const sel = window.getSelection();
						if (!this.inputElement.contains(sel.anchorNode)) return;
						if (!sel.rangeCount) return;
						const range = sel.getRangeAt(0);
						const container = range.startContainer;
						// Find the closest UL ancestor
						const ul = container.nodeType === 1 ? container.closest("ul[checklist]") : container.parentElement.closest("ul[checklist]");
						if (ul) {
							// ✅ Enter pressed inside a UL 
							evt.preventDefault();
							// Create new LI with default state 
							const newLi = document.createElement("li");
							newLi.setAttribute("unchecked", "");
							newLi.innerHTML = "<br>";
							// attachCheckboxEvent(newLi);
							// Insert after current LI 
							const currentLi = container.nodeType === 1 ? container.closest("li") : container.parentElement.closest("li");
							if (currentLi) {
								currentLi.insertAdjacentElement("afterend", newLi);
								// Move caret into new LI 
								const newRange = document.createRange();
								newRange.setStart(newLi, 0);
								newRange.collapse(true);
								sel.removeAllRanges();
								sel.addRange(newRange);
								this.inputElement.dispatchEvent(new Event("input", { bubbles: true }));
							}
						}
					}
				},
				onMouseUp(evt) {
					this.detectTextFormat();
				},
				detectTextFormat() {
					const editable = this.__element.querySelector("[contenteditable]");
					if (!editable) return;

					const selection = window.getSelection();
					if (!selection.rangeCount) return;

					const range = selection.getRangeAt(0);
					if (!editable.contains(range.commonAncestorContainer)) return;

					let node = range.commonAncestorContainer;
					if (node.nodeType === 3) node = node.parentElement;

					// Check for formatting tags
					let hasBold = false;
					let hasItalic = false;
					let hasUnderlined = false;
					let hasCrossed = false;

					// Walk up the DOM tree to find formatting tags
					let current = node;
					while (current && current !== editable) {
						const tagName = current.tagName?.toUpperCase();
						if (tagName === 'B' || tagName === 'STRONG') hasBold = true;
						if (tagName === 'I' || tagName === 'EM') hasItalic = true;
						if (tagName === 'U') hasUnderlined = true;
						if (tagName === 'S') hasCrossed = true;
						current = current.parentElement;
					}

					// Update textmodes based on detected formats
					selectionTextMode = [];
					if (hasBold) selectionTextMode.push("bold");
					if (hasItalic) selectionTextMode.push("italic");
					if (hasUnderlined) selectionTextMode.push("underlined");
					if (hasCrossed) selectionTextMode.push("crossed");

					this.updateFormatButtonsManually();
				},
				highlightInlineCommands() {
					if (!this.inputElement) return;
					const editable = this.inputElement;
					const text = editable.textContent || "";
					if (!text.includes("#")) {
						removeInlineCommandSpans(editable, text);
						return;
					}
					const commandPattern = innerTextCommands
						.map(cmd => cmd.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&"))
						.join("|");
					if (!commandPattern) return;
					const regex = new RegExp(`(#(?:${commandPattern}):[^\\s]+)`, "g");
					const caretOffset = getCaretCharacterOffsetWithin(editable);
					const matches = [...text.matchAll(regex)];
					if (!matches.length) {
						removeInlineCommandSpans(editable, text);
						setCaretPosition(editable, caretOffset);
						return;
					}
					let html = "";
					let lastIndex = 0;
					for (const match of matches) {
						if (match.index === undefined) continue;
						const token = match[1];
						const start = match.index;
						if (start > lastIndex) {
							html += escapeHtml(text.slice(lastIndex, start));
						}
						html += `<span data-inline-cmd="${escapeHtml(token)}" underline text-color='info' class='interactable'>${escapeHtml(token)}</span>`;
						lastIndex = start + token.length;
					}
					if (lastIndex < text.length) {
						html += escapeHtml(text.slice(lastIndex));
					}
					const normalizedHtml = html || escapeHtml(text);
					if (editable.innerHTML !== normalizedHtml) {
						editable.innerHTML = normalizedHtml;
					}
					setCaretPosition(editable, caretOffset);
				},
				checkTextSelected() {
					const selection = window.getSelection();
					let isSelected = selection && selection.rangeCount > 0 && this.inputElement.contains(selection.anchorNode) && selection.toString().length > 0;
					if (isSelected != this.textSelected) this.textSelected = isSelected;
				},
				setList() {
					const editable = this.__element.querySelector("[contenteditable]");
					renderList(editable, "ul");
					this.valore = editable.innerHTML;
				},
				setNumericList() {
					const editable = this.__element.querySelector("[contenteditable]");
					renderList(editable, "ol");
				},
				setCheckList() {
					const editable = this.__element.querySelector("[contenteditable]");
					renderList(editable, "ul", (...elements) => {
						for (const el of elements) {
							if (el.tagName === "UL") {
								el.setAttribute("checklist", "");
							}
							if (el.tagName === "LI") {
								el.setAttribute("unchecked", "");
								// attachCheckboxEvent(el);
							}
						}
					});
					this.valore = editable.innerHTML;
				},
				setupCheckboxEvents() {
					const editable = this.__element.querySelector("[contenteditable]");
					const checkboxes = editable.querySelectorAll("li[unchecked], li[checked]");
					checkboxes.forEach(el => attachCheckboxEvent(el));
				},
				updateFormatButtonsManually() {
					this.__element.querySelector("[obi-button][title='Bold']")?.setAttribute('relevance', this.isBold ? 'primary' : null);
					this.__element.querySelector("[obi-button][title='Italic']")?.setAttribute('relevance', this.isItalic ? 'primary' : null);
					this.__element.querySelector("[obi-button][title='Underlined']")?.setAttribute('relevance', this.isUnderlined ? 'primary' : null);
					this.__element.querySelector("[obi-button][title='Crossed']")?.setAttribute('relevance', this.isCrossed ? 'primary' : null);
				},
				submitTrigger() {

					var { commands, text } = catchInnerTextCommends(this.inputElement?.innerText ?? this.valore);

					const me = this;
					loadApi(`${BASE_URL}/src/models/EmailRequest.js`, async (EmailRequest) => {
						const url = `${API_URL}/obiHub/api/Hub/Email`;
						for (let cmd of commands) {
							switch (cmd.type) {
								case "mailto":
									const [email, query] = cmd.value.split("?");
									const receiver = email || "";
									const params = new URLSearchParams(query || "");
									const subject = params.get("sub") || "";

									const from = me.currentUser?.email ?? `applicativi@obi-italia.it`;
									const nominativo = me.currentUser?.nome ?
										` da ${me.currentUser.nome} ${me.currentUser.cognome}` :
										(` da ${me.currentUser?.username}` ?? "");

									const body = text?.split(/(?:<br>|\n)/g) ?? "";
									if (body) {
										const request = new EmailRequest({
											header: {
												from: from,
												sender: from,
												receiver: receiver,
												subject: subject || `Nuova Comunicazione`,
											},
											content: body,
										});
										try {
											const response = await fetch(url, {
												method: "PUT",
												headers: { "Content-Type": "application/json" },
												body: JSON.stringify(request)
											});

											if (!response.ok) {
												// We include the response.status directly in the error message string
												throw new Error(`Errore nell'invio della email (Status: ${response.status})`);
											}
											obiAlert("Email inviata con successo", { type: "success" });

											// If you need to read the response data, you can do it here:
											// const data = await response.json();

										} catch (error) {
											console.error(error);
											obiAlert("Errore nell'invio della email", { type: "error" });
										}
									}
									break;
							}
							me.__node.trigger("command", cmd);
						}
					});

					function catchInnerTextCommends(text) {
						if (!text) return { commands: [], text: "" };

						let cleanedText = text;
						const commands = [];

						for (const cmd of innerTextCommands) {
							const regex = new RegExp(`#${cmd}:([^\\s]+)`, 'g');
							let match;
							while ((match = regex.exec(cleanedText)) !== null) {
								commands.push({ type: cmd, value: match[1] });
							}
							cleanedText = cleanedText.replace(regex, '').trim();
						}

						cleanedText = cleanedText.replace(/\\s{2,}/g, ' ').trim();
						return { commands, text: cleanedText };
					}
				}
			},
			events: [
				{
					name: "progress",
					action: function (state) {
						if (state == "mounted") {
							if (!this.valore) {
								let _input = this.__element.querySelector("[contenteditable]");
								if (_input && this.righe) {
									_input.parentElement.style.minHeight = (this.righe * 18) + "px";
								}
							}
						}
					},
				},
				{
					name: "render",
					action: function () {
						this.setupCheckboxEvents();
					}
				}
			]
		}
	}
)
function removeInlineCommandSpans(editable, text) {
	const spans = editable.querySelectorAll('span[data-inline-cmd]');
	if (!spans.length) return;
	spans.forEach(span => span.replaceWith(document.createTextNode(span.textContent || '')));
	editable.textContent = text;
}

function escapeHtml(text) {
	return text.replace(/[&<>"]+/g, function (match) {
		switch (match) {
			case '&': return '&amp;';
			case '<': return '&lt;';
			case '>': return '&gt;';
			case '"': return '&quot;';
		}
		return match;
	});
}

function getCaretCharacterOffsetWithin(element) {
	if (!element || !(element instanceof Node)) return 0;
	const selection = window.getSelection();
	if (!selection || !selection.rangeCount) return 0;
	const range = selection.getRangeAt(0);
	const container = range.commonAncestorContainer;
	if (!element.contains(container) && container !== element) return 0;
	const preCaretRange = range.cloneRange();
	try {
		preCaretRange.selectNodeContents(element);
	} catch (err) {
		return 0;
	}
	preCaretRange.setEnd(range.endContainer, range.endOffset);
	return preCaretRange.toString().length;
}

function setCaretPosition(element, offset) {
	const selection = window.getSelection();
	selection.removeAllRanges();
	const range = document.createRange();
	let current = element;
	let currentOffset = 0;

	function traverse(node) {
		if (!node || currentOffset > offset) return false;
		if (node.nodeType === Node.TEXT_NODE) {
			const nextOffset = currentOffset + node.nodeValue.length;
			if (nextOffset >= offset) {
				range.setStart(node, offset - currentOffset);
				range.collapse(true);
				return true;
			}
			currentOffset = nextOffset;
			return false;
		}
		for (let child = node.firstChild; child; child = child.nextSibling) {
			if (traverse(child)) return true;
		}
		return false;
	}

	traverse(element);
	selection.addRange(range);
}

function renderList(editable, tag, options = null) {
	if (!editable) return;

	const selection = window.getSelection();
	if (!selection.rangeCount) return;

	const range = selection.getRangeAt(0);
	if (!editable.contains(range.commonAncestorContainer)) return;

	// If nothing selected, insert an empty list item
	if (range.collapsed) {
		const container = document.createElement(tag);
		const li = document.createElement("li");
		if (options) { options(container, li); }
		container.appendChild(li);
		range.insertNode(container);

		// Place cursor inside the new li
		const newRange = document.createRange();
		newRange.selectNodeContents(li);
		newRange.collapse(true);
		selection.removeAllRanges();
		selection.addRange(newRange);
		return;
	}

	// Clone selection to analyze structure
	const fragment = range.cloneContents();

	const isBlockBoundary = (el) => {
		const tag = el.tagName;
		return tag === "DIV" || tag === "P" || tag === "LI";
	};

	// Build lines by recursively visiting nodes and breaking at block/BR boundaries
	const lines = [];
	let current = "";

	function visit(node) {
		if (node.nodeType === Node.TEXT_NODE) {
			current += node.textContent;
			return;
		}

		if (node.nodeType === Node.ELEMENT_NODE) {
			const tag = node.tagName;

			if (tag === "BR") {
				lines.push(current);
				current = "";
				return;
			}

			if (isBlockBoundary(node)) {
				// Boundary before block
				if (current.trim() !== "") {
					lines.push(current);
					current = "";
				}
				// Process contents of the block
				node.childNodes.forEach(visit);
				// Boundary after block (flush any accumulated from inside)
				if (current.trim() !== "") {
					lines.push(current);
					current = "";
				}
				return;
			}

			// Inline element: traverse into children
			node.childNodes.forEach(visit);
		}
	}

	fragment.childNodes.forEach(visit);

	// Flush trailing text if any
	if (current.trim() !== "") {
		lines.push(current);
	}

	// Normalize lines (trim, remove empties except if only one line)
	const normalized = lines
		.map(l => l.replace(/\u00A0/g, " ").trim())
		.filter((l, idx) => l.length > 0 || (idx === 0 && lines.length === 1));

	// Create UL with LIs from normalized lines
	const container = document.createElement(tag);
	if (options) options(container);
	if (normalized.length === 0) {
		let li = document.createElement("li");
		if (options) options(li);
		container.appendChild(li);
	} else {
		normalized.forEach(line => {
			const li = document.createElement("li");
			li.textContent = line;
			if (options) options(li);
			container.appendChild(li);
		});
	}

	// Replace the selected content with the new list
	range.deleteContents();
	range.insertNode(container);
	// Move cursor to the first li
	const newRange = document.createRange();
	const firstLi = container.querySelector("li") || container.firstChild;
	newRange.selectNodeContents(firstLi);
	newRange.collapse(true);
	selection.removeAllRanges();
	selection.addRange(newRange);
}

function attachCheckboxEvent(el) {
	el.removeEventListener("click", handleClick);
	el.addEventListener("click", handleClick);
}
function handleClick(evt) {
	const el = evt.currentTarget;
	const rect = el.getBoundingClientRect();
	const clickX = evt.clientX - rect.left;
	if (clickX <= 20) {
		if (el.hasAttribute("unchecked")) {
			el.removeAttribute("unchecked");
			el.setAttribute("checked", "");
		} else {
			el.removeAttribute("checked");
			el.setAttribute("unchecked", "");
		}
		el.closest("div[contenteditable]").dispatchEvent(new Event("input", { bubbles: true }));
	}
}