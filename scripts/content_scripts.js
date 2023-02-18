let send = true
// console.log("jhvvghvghvhhj");
// util
const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

// connect to the port from the popup
chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(async (data) => {
        if (data.msg === "Start sending") {
            send = true
            // start 
            // select all elements from search results
            var searchResults = document.querySelectorAll(".entity-result")

            // looping into searchResults by for-of(sync)
            for (const result of searchResults) {
                console.log(result);
                if (send) {
                    // wait for 10 seconds
                    await wait(3000)
                    let success = true

                    // -- get the name of the user -- 

                    // select all tags in result with '.entity-result__title-text'
                    let nameTagText = result.querySelector('.entity-result__title-text').innerText
                    let userName = nameTagText.split('\n')[0]
                    console.log(userName);

                    // -- click the connect button, don't if its 'Message/Follow' --
                    let btn = result.querySelector(".artdeco-button__text")

                    if (btn.innerText === "Connect") {
                        // click
                        btn.click()
                        // if a popup opens, click on its close btn
                        //wait 2 sec
                        await wait(2000)
                        let bar = document.querySelector('.artdeco-modal__actionbar')
                        let sendBtn = bar.querySelector('.artdeco-button--primary')
                        sendBtn.click()
                    }
                    else {
                        success = false
                    }

                    // send Message to popup script
                    port.postMessage({
                        success, userName
                    })
                }
                else {
                    return
                }
            }

            // all done 
            port.postMessage({
                done: true
            })

        }
        else {
            send = false
        }
    })
})