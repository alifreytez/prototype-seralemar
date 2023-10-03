function FloatingMessage() {}

FloatingMessage.wrapper = document.getElementById("floating-message");
FloatingMessage.list = [];
FloatingMessage.time = 5000;
FloatingMessage.say = function(message, type) {
    const messageElement = document.createElement("div");
    
    messageElement.innerHTML = `<i></i><p>${message}</p>`;
    messageElement.classList.add("floating-message");
    if (type != "")
        messageElement.classList.add(type);

    FloatingMessage.prepareTimer(messageElement);
}
FloatingMessage.prepareTimer = function(messageElement) {
    FloatingMessage.list.push(setTimeout(() => messageElement.remove(), FloatingMessage.time));
    FloatingMessage.wrapper.insertAdjacentElement("beforeend", messageElement);
    setTimeout(() => messageElement.classList.add("show"), 100);
}

export default FloatingMessage;