'use strict';

/**
 * This file shows how client-side javascript can be included via a plugin.
 * If you check `plugin.json`, you'll see that this file is listed under "scripts".
 * That array tells NodeBB which files to bundle into the minified javascript
 * that is served to the end user.
 *
 * There are two (standard) ways to wait for when NodeBB is ready.
 * This one below executes when NodeBB reports it is ready...
 */

function initChat() {

	const chatInput = document.getElementById('chat-input');
	const sendButton = document.getElementById('send-button');
	const chatBox = document.getElementById('chat-box');


	socket.emit('plugins.AIChatPlugin.getSettings', {}, function (err, data) {
		if (err) {
			console.log(err)


			//Initialize WebSocket
			let socket_ = new WebSocket(data.brain - url);

			// Function to append messages to chat box
			const appendMessage = (message, sender) => {
				const messageElement = document.createElement('div');
				messageElement.classList.add('message', sender);
				messageElement.textContent = message;
				chatBox.appendChild(messageElement);
				chatBox.scrollTop = chatBox.scrollHeight;
			};

			// Event listener for Enter key press
			chatInput.addEventListener('keypress', (event) => {
				if (event.key === 'Enter') {
					sendMessage();
				}
			});

			// Event listener for Send button click
			sendButton.addEventListener('click', sendMessage);

			// Function to send message
			function sendMessage() {
				if (socket.readyState !== WebSocket.OPEN) {
					console.log('WebSocket is not open, reconnecting...');
					socket_.close();
					socket_ = new WebSocket(data.brain - url);
				}
				const message = chatInput.value.trim();
				appendMessage(message, 'user');
				console.log(message);
				if (message) {
					alert('message sending')
					const payload = {
						question: message,
						action: "community",
						chat_id: "9d9e7a47-fbf6-4385-8b7e-041a3d79e51f",
						brain_name: "CommunityKnowledgeBase",
						token: data.token,
						type: "Chat"
					};
					const newMessage = JSON.stringify(payload);

					socket_.send(newMessage);
					chatInput.value = '';
				}
			}
			// WebSocket event listeners
			socket_.addEventListener('open', () => {
				console.log('Connected to WebSocket server');
			});

			socket_.addEventListener('message', (event) => {

				try {
					// Attempt to parse the message as JSON
					const message = JSON.parse(event.data);

					// Check if the message contains the 'statusCode' field
					if (message.statusCode === 100) {
						console.log('Status code 100 received, ignoring...');
						// Handle status code 100 if needed, otherwise ignore
						return;
					}
					else if (message.statusCode === 200)
						// Check if the message contains the 'assistant' field
						if (message.assistant) {
							appendMessage(message.assistant, 'server');
						}
				} catch (e) {
					// Handle the case where the message is not JSON (or parsing failed)

				}
			});

			socket_.addEventListener('close', () => {
				console.log('Disconnected from WebSocket server');
			});

			socket_.addEventListener('error', (error) => {
				console.error('WebSocket error:', error);
			});
		}
		else {
			console.log(data)
		}
	});


}


(async () => {
	const hooks = await app.require('hooks');

	hooks.on('action:app.load', () => {
		// called once when nbb has loaded
	})

	hooks.on('action:ajaxify.end', (data) => {
		// called everytime user navigates between pages including first load
	});

	
	hooks.on('action:ajaxify.dataLoaded', (data) => {
	     initChat();
	   // called everytime user navigates between pages including first load
   });
})();

/**
 * ... and this one reports when the DOM is loaded (but NodeBB might not be fully ready yet).
 * For most cases, you'll want the one above.
 */

$(document).ready(function () {
	initChat()
});
