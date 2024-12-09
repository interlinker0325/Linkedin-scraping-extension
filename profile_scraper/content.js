chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'click') {
        let counter = 0;
        let intervalId = setInterval(() => {
            window.scrollBy(0, 200);
            counter++;
            console.log('Counter:', counter);

            // Stop the interval after 5 iterations
            if (counter >= 100) {
                clearInterval(intervalId);
                console.log('Interval stopped after 5 iterations');
            }
        }, 1000);
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