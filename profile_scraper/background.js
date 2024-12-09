chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start') {
        console.log("Scraping is started!");
        const links = message.links;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let counter = 0;
            let flag = false;

            async function Action() {

                await chrome.tabs.update(tabs[0].id, { url: links[counter] });

                await new Promise(resolve => setTimeout(resolve, 10000));
                // if (!flag) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'click' }, function (response) {
                    if (chrome.runtime.lastError) {
                        console.error("Error message:", chrome.runtime.lastError.message)
                    } else {
                        console.log("Retrival successfully")
                    }
                });
                //     flag = true;
                // }

                await new Promise(getProfile => setTimeout(getProfile, 110000));
                // setTimeout(() => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'getProfile' }, function (response) {
                    console.log(response.links, "response----->");
                    send_data(response.links, links[counter], counter);
                });
                // }, 110000)
                counter++;
                console.log(counter, "counter--->")

                if (counter >= links.length) {
                    console.log("All links processed.");
                    clearInterval(intervalId); // Stop the interval if all links are processed
                    return;
                }
            }
            Action();
            const intervalId = setInterval(Action, 120000)
        });
    }
});

function send_data(links, companyUrl, counter) {
    const server_url = 'https://wise-top-labrador.ngrok-free.app/save';
    const data = {
        links: links,
        companyUrl: companyUrl,
        counter: counter
    }

    fetch(server_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
}