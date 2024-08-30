
<style>

.chat-container {
    width: 100%;
    max-width: 600px;
    height: 80vh;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden;
}

.chat-box {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    border-bottom: 1px solid #ddd;
    color:black;
}

.input-container {
    display: flex;
    padding: 10px;
    background-color: #f9f9f9;
}

#chat-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
}

#send-button {
    padding: 10px 20px;
    margin-left: 10px;
    background-color: #007bff;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

#send-button:hover {
    background-color: #0056b3;
}
</style>
<script>
</script>

    <div class="card card-body text-bg-light chat-container">
        <div class="chat-box" id="chat-box">
		</div>
        <div class="input-container">
            <input type="text" id="chat-input" placeholder="Type your message here..." autocomplete="off">
            <button id="send-button">Send</button>
        </div>
    </div>
