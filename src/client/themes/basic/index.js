const handleMessage = (event) => {
    // if (event.origin !== 'http://your-parent-domain.com') {
    //   return;
    // }

    const receivedData = event.data;

    console.log('Data received in the iframe:', receivedData);

    document.querySelector("#fill-title").textContent = receivedData.title;
};

window.addEventListener('message', handleMessage);