chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'click') {
        let counter = 0;

        let initialHeight = 0;
        const scrollPage = () => {
            chrome.storage.local.remove(['myData'], function () {
                console.log('Data has been removed from Chrome storage.');
            });

            let intervalId = setInterval(() => {
                window.scrollBy(0, 600);
                counter++
                console.log(counter, "counter")

                // Update totalHeight and scrollHeight after scrolling
                let totalHeight = document.body.scrollHeight;
                console.log(totalHeight, "totalHeight-------->")

                if (totalHeight != initialHeight) {
                    number = 0;
                    initialHeight = totalHeight;
                }
                else if (totalHeight == initialHeight) {
                    number++;
                    if (number > 8) {
                        clearInterval(intervalId);
                        const data = "true";
                        chrome.storage.local.set({ myData: data }, function () {
                            console.log('Data has been saved to Chrome storage.');
                        });

                        chrome.storage.local.get(['myData'], function (result) {
                            console.log('Retrieved data:', result.myData);
                        });
                    }
                }
            }, 1000);
        }
        scrollPage();
    }
    if (message.action === 'getProfile') {
        let persons = document.querySelectorAll("li.grid.grid__col--lg-8.block.org-people-profile-card__profile-card-spacing");
        const links = new Array();

        for (const person of persons) {
            let a = person.querySelector("div.artdeco-entity-lockup__title a");
            links.push(a?.getAttribute('href'));
        }
        console.log(links, "links----->")
        sendResponse({ links: links });
    }
});