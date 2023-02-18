const btn = document.getElementById('btn')
const outer = document.getElementById('outer')
const inner = document.getElementById('inner')
const para = document.getElementById('para')
const update = document.getElementById('update')

// setting up long lived connections to communicate with content_scripts
let port = undefined
async function connectToPort() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    console.log(tabs);
    port = chrome.tabs.connect(tabs[0].id, {
        name: "linkedinExt"
    })

    // listen to the messages from content_script
    port.onMessage.addListener((data) => {
        // update the count
        if (data.success) {
            console.log(para.innerText);
            para.innerText = Number(para.innerText) + 1
        }
        // show the user followed
        if (data.success) {
            update.innerText = `Successfully sent: ${data.userName}`
            update.classList.remove('failed')
            update.classList.add('update')
        }
        else {
            update.innerText = `Already connected/Private: ${data.userName}`
            update.classList.remove('update')
            update.classList.add('failed')
        }

        // all done
        if (data && data.done) {
            update.innerText = "Sent to all profiles of this page"
            outer.className = "outerStatic"
            inner.className = "innerStatic"
            btn.innerText = "Start"
            update.classList.remove('failed')
            update.classList.add('update')
        }
    })
}

// button function 
async function setAnimationAndText() {
    if (!port) {
        await connectToPort()
    }
    if (btn.innerText === "Start") {
        // change button to stop and start animation
        btn.innerText = "Stop"
        outer.className = "outerCircle"
        update.innerText = "Awaiting Response..."
        inner.className = "innerCircle"
        para.innerText = 0

        // send message to control_script to start the work
        port.postMessage({
            msg: "Start sending"
        })
    }
    else {
        // stop animation and set innerText of para 0
        outer.className = "outerStatic"
        inner.className = "innerStatic"
        btn.innerText = "Start"
        para.innerText = 0
        update.innerText = "Awaiting Response..."
        update.classList.remove('failed')
        update.classList.add('update')
        update.innerText = "Click Start"

        // send message to control_script to stop the work
        port.postMessage({
            msg: "Stop sending"
        })
    }
}



// set onclick event on the button
document.getElementById('btn').addEventListener('click', setAnimationAndText)