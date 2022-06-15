const TwitterStream = require('./stream.js');
const { fork } = require('child_process');

(async () => {
    const rules = [ {value: 'testtweet'} ];
    let currentRules;
    let twitterStream = new TwitterStream(rules);

    try 
    {
        currentRules = await twitterStream.getAllRules();

        await twitterStream.deleteAllRules(currentRules);

        await twitterStream.setRules();
    } 
    catch(e)
    {
        console.error(e);
        process.exit(1);
    }

    const filterProcess = fork('./filterProcess.js');

    twitterStream.streamConnect(filterProcess);

})();