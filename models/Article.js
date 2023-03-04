const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    markdown: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;