# AI chat Plugin for NodeBB

AI-Powered Chat Integration: Enhance your NodeBB forum with an AI-powered chat feature that connects to your knowledge base. The plugin uses advanced Retrieval-Augmented Generation (RAG) with OpenAI's language model to provide intelligent responses based on community-indexed documents.

Seamless Authorization and WebSocket Communication: The plugin initiates a token request to the authorization server when the AI chat page loads. Once authenticated, it establishes a WebSocket connection with your knowledge base URL, ensuring real-time, secure communication.

Customizable Admin Settings: Admins can easily configure the plugin by providing necessary details such as the client ID, client secret, knowledge base URL, and authorization server URL. This ensures that the AI chat is tailored to your community's specific needs.

Dynamic AI Chat for Forums: The AI Chat Plugin for NodeBB enables dynamic, context-aware conversations within your forum. By leveraging your knowledge base, it provides accurate and relevant answers, enriching the user experience with AI-driven insights.

Easy Integration and Setup: Designed with simplicity in mind, the AI Chat Plugin can be quickly integrated into your NodeBB forum. With minimal setup required, you can offer your community an advanced AI chat system that leverages your existing knowledge base.



The plugin uses the filter:ai-chat.build hook to execute the loadValues method. This method is responsible for checking the token stored in the settings. If the token has expired, loadValues fetches a new token and updates the templateData. Additionally, if the Knowledge Base Server URL is changed in the admin settings, loadValues retrieves the updated URL and includes it in templateData.

The templateData is then utilized in the client-side through the action:ajaxify.dataLoaded hook to handle page navigation. When a page refresh occurs, the required data is fetched from the server using Socket.io with the following approach:

Client-side Code:

```
socket.emit('plugins.AIChatPlugin.getSettings', {}, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        // Handle chat initialization with the received data
    }
});

```
Server-side Code:


```
socketPlugins.AIChatPlugin = {};
socketPlugins.AIChatPlugin.getSettings = function(socket, data, callback) {
    meta.settings.get('ai-chat')
    .then(settings => {
        let settingsData = { 
            'brain-url': settings['brain-url'],
            'token': settings['token'] 
        };
        callback(null, { data: settingsData });
    })
    .catch(err => {
        callback(err);
    });
};
```
This server-side code is registered in the plugin's init method, ensuring that the latest settings are always available for the chat functionality, regardless of whether the page is refreshed or navigated via links.

## Installation

    npm install nodebb-plugin-ai-chat

## Screenshots

Don't forget to add screenshots!
