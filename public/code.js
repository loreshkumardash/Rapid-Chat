(function(){

    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    const joinScreen = app.querySelector(".join-screen");
    const chatScreen = app.querySelector(".chat-screen");

    function joinChat() {
        let username = joinScreen.querySelector("#username").value.trim();
        if (username.length === 0) {
            // You might want to show an error to the user here
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        joinScreen.classList.remove("active");
        chatScreen.classList.add("active");
        chatScreen.querySelector("#message-input").focus();
    }

    // --- Event Listeners for Joining Chat ---
    joinScreen.querySelector("#join-user").addEventListener("click", joinChat);
    joinScreen.querySelector("#username").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            joinChat();
        }
    });

    function sendMessage() {
        let messageText = chatScreen.querySelector("#message-input").value.trim();
        if (messageText.length === 0) {
            return;
        }
        renderMessage("my", {
            username: uname,
            text: messageText
        });
        socket.emit("chat", {
            username: uname,
            text: messageText
        });
        chatScreen.querySelector("#message-input").value = "";
        chatScreen.querySelector("#message-input").focus();
    }

    // --- Event Listeners for Sending a Message ---
    chatScreen.querySelector("#send-message").addEventListener("click", sendMessage);
    chatScreen.querySelector("#message-input").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // --- Event Listener for Exiting Chat ---
    chatScreen.querySelector("#exit-chat").addEventListener("click", function() {
        socket.emit("exituser", uname);
        // Reloading the page is a simple way to go back to the join screen
        window.location.href = window.location.href;
    });

    // --- Socket Listeners for Server Events ---
    socket.on("update", function(update) {
        renderMessage("update", update);
    });

    socket.on("chat", function(message) {
        renderMessage("other", message);
    });

    // --- Helper function to display messages ---
    function renderMessage(type, message){
        let messageContainer = chatScreen.querySelector(".messages");
        let el = document.createElement("div");

        if(type === "my"){
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text"></div>
                </div>
            `;
            el.querySelector(".text").innerText = message.text;
        } else if (type === "other"){
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name"></div>
                    <div class="text"></div>
                </div>
            `;
            el.querySelector(".name").innerText = message.username;
            el.querySelector(".text").innerText = message.text;
        } else if (type === "update"){
            el.setAttribute("class", "update");
            el.innerText = message;
        }
        
        messageContainer.appendChild(el);
        // Scroll to the latest message
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

})();