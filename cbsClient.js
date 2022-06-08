const axios = require('axios').default;

(async() => {

    const port = '1234';
    const baseURL = "http://localhost:" + port;

    // Read the incoming messages from parent
    process.on("message", async (message) => {

        const data = {
            text: message.data.data.text,
            location: message.location
        };

        axios.post(baseURL + "/messages", data);

    });

})();