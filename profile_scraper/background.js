chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start') {
        console.log("Scraping is started!");
        const links = message.links;

        function getData(callback) {
            const key = "myData";
            chrome.storage.local.get([key], function (result) {
                callback(result[key] || null);
            });
        }

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let counter = 0;
            async function processLinks() {
                while (counter < links.length) {
                    try {
                        // Step 1: Navigate to the URL
                        await chrome.tabs.update(tabs[0].id, { url: links[counter] });
                        console.log(`Navigated to: ${links[counter]}`);

                        // Step 2: Wait for 10 seconds
                        await new Promise(resolve => setTimeout(resolve, 10000));

                        // Step 3: Run the click action
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'click' }, function (response) {
                            if (chrome.runtime.lastError) {
                                console.error("Error message:", chrome.runtime.lastError.message)
                            } else {
                                console.log("Retrival successfully")
                            }
                        });
                        const profileResponse = await new Promise((resolve, reject) => {
                            const monitoringInterval = setInterval(() => {
                                getData((result) => {
                                    console.log(result, "result---------------->");
                                    if (result === "true") { // Check if the result is "true"
                                        clearInterval(monitoringInterval); // Stop the interval

                                        // Send a message to the content script to get the profile
                                        chrome.tabs.sendMessage(tabs[0].id, { action: "getProfile" }, function (response) {
                                            if (chrome.runtime.lastError) {
                                                console.error("Error sending message:", chrome.runtime.lastError.message);
                                                reject(new Error(chrome.runtime.lastError.message)); // Reject on error
                                            } else {
                                                console.log(response.links, "response----->");
                                                // send_data(response.links, links[counter], counter); // Send data after receiving profile
                                                resolve(response); // Resolve with the response
                                            }
                                        });
                                    }
                                });
                            }, 1000); // Check every 1 second
                        });
                        // Step 5: Send data to the server after receiving profileResponse
                        send_data(profileResponse.links, links[counter], counter);
                        chrome.storage.local.remove(['myData'], function () {
                            console.log('Data has been removed from Chrome storage.');
                        });
                        // Increment the counter after processing
                        counter++;
                        console.log(`Processed link ${counter}/${links.length}`);

                    } catch (error) {
                        console.error("Error during processing:", error);
                        break; // Exit the loop if there's an error
                    }
                }
                console.log("All links processed.");
            }

            // Start processing the links
            processLinks();
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