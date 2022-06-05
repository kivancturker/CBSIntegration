
const { Schema } = require('mongoose');

const PublicMetrics = {
    retweet_count: Number,
    reply_count: Number,
    like_count: Number,
    quote_count: Number
}

const User = {
    id: String,
    name: String,
    username: String
}

const MathcingRule = {
    id: String,
    tag: String
}

const Data = {
    author_id: String,
    id: String,
    public_metrics: PublicMetrics,
    text: String    
}

const Includes = {
    users: [User]
}

const TweetSchema = new Schema({
    data: Data,
    includes: Includes,
    matching_rules: [MathcingRule]
});

module.exports = {
    TweetSchema: TweetSchema
};