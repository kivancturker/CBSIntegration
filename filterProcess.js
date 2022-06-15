const { fork } = require('child_process');
const Filter = require('./filter');


(async() => {

    // const databaseProcess = fork('./database.js');
    const cbsClientProcess = fork('./cbsClient.js');
    const location = "X";

    const filter = new Filter()
                        .setHardFile("./hard.txt")
                        .setSoftFile("./soft.txt")
                        .initDictionary();

    // Read the incoming messages from parent
    process.on("message", async (data) => {

        // databaseProcess.send(data);

        filter.setText(data.data.text);

        if (filter.isSafeText())
        {
            const twitAndLoc = { data: data, location: location };
            cbsClientProcess.send(twitAndLoc);
        }
        
    });

})();