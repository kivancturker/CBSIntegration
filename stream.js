const config = require('dotenv').config();
const needle = require('needle');

class TwitterStream {

    #streamURL = 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id';
    #rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
    #token = process.env.TWITTER_TOKEN;
    #retryAttempt = 0;

    constructor (rules) {
        this.rules = rules;
    }

    async getAllRules() {

        const response = await needle('get', this.#rulesURL, {
            headers: {
                "authorization": `Bearer ${this.#token}`
            }
        })
    
        if (response.statusCode !== 200) {
            console.log("Error:", response.statusMessage, response.statusCode)
            throw new Error(response.body);
        }
    
        console.log(response.body);
        return (response.body);
    }
    
    async deleteAllRules(currentRules) {
    
        if (!Array.isArray(currentRules.data)) {
            return null;
        }
    
        const ids = currentRules.data.map(rule => rule.id);
    
        const data = {
            "delete": {
                "ids": ids
            }
        }
    
        const response = await needle('post', this.#rulesURL, data, {
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${this.#token}`
            }
        })
    
        if (response.statusCode !== 200) {
            console.error("deleteAllRules Status Code: " + response.statusCode);
            throw new Error(response.body);
        }
    
        return (response.body);
    
    }
    
    async setRules() {
    
        const data = {
            "add": this.rules
        }
    
        const response = await needle('post', this.#rulesURL, data, {
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${this.#token}`
            }
        })
    
        if (response.statusCode !== 201) {
            throw new Error(response.body);
        }
    
        return (response.body);
    
    }
    
    streamConnect(processToSend) {
    
        const stream = needle.get(this.#streamURL, {
            headers: {
                "Authorization": `Bearer ${this.#token}`
            },
            timeout: 20000
        });
    
        stream.on('data', data => {
            try {
                const json = JSON.parse(data);
                // Send data to another process
                processToSend.send(json);
                // A successful connection resets retry count.
                this.#retryAttempt = 0;
            } catch (e) {
                if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
                    console.log(data.detail)
                    process.exit(1)
                } else {
                    // Keep alive signal received. Do nothing.
                }
            }
        }).on('err', error => {
            if (error.code !== 'ECONNRESET') {
                console.log(error.code);
                process.exit(1);
            } else {
                // This reconnection logic will attempt to reconnect when a disconnection is detected.
                // To avoid rate limits, this logic implements exponential backoff, so the wait time
                // will increase if the client cannot reconnect to the stream. 
                setTimeout(() => {
                    console.warn("A connection error occurred. Reconnecting...")
                    streamConnect(++this.#retryAttempt);
                }, 2 ** this.#retryAttempt)
            }
        });
    
        return stream;
    
    }

}

module.exports = TwitterStream;