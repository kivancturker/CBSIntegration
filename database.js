
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { TweetSchema } = require('./models.js');
const { fork } = require('child_process');

(async() => {

    // Config
    // Connect to mongodb
    await mongoose.connect(process.env.MONGO_URI);

    // Read the incoming messages from parent
    process.on("message", async (data) => {

        const Tweet = mongoose.model('Tweet', TweetSchema);

        const doc = new Tweet(data); 

        await doc.save();
        
    });

})();