class Button {
  text = "";
  element = null;
  constructor(text) {
    this.text = text;
    this.element = window.document.createElement("button");
    this.element.appendChild(window.document.createTextNode(this.text));
  }
}
