document.addEventListener('DOMContentLoaded', async () => {
    const titleInput = document.getElementById('title');
    const linkInput = document.getElementById('link');
    const messageInput = document.getElementById('message');
    const sendBtn = document.getElementById('sendBtn');

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    titleInput.value = tab.title;
    linkInput.value = tab.url;

    sendBtn.addEventListener('click', async () => {
        const webhookUrl = await getWebhookUrl();
        if (!webhookUrl) return alert('Webhook URL not set in options.');

        const embed = {
            username: "Patreon Bot",
            embeds: [{
                title: titleInput.value,
                url: linkInput.value,
                description: messageInput.value,
                color: 7506394
            }]
        };

        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embed)
        }).then(res => {
            if (res.ok) alert('Message sent!');
            else alert('Failed to send message.');
        }).catch(err => alert('Error: ' + err.message));
    });

    async function getWebhookUrl() {
        return new Promise(resolve => {
            chrome.storage.sync.get(['webhookUrl'], (result) => {
                resolve(result.webhookUrl);
            });
        });
    }
});