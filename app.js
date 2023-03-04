const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Article = require('./models/Article');
const methodOverride = require('method-override');

mongoose.connect('mongodb://127.0.0.1:27017/newsdb')
    .then(() => {
        console.log('Database connected');
    })
    .catch((e) => {
        console.log(e);
    })

const app = express();
const PORT = 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public', 'css')));
app.use(express.static(path.join(__dirname, 'public', 'js')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', async(req, res) => {
    const articles = await Article.find({ title: { $regex: '^' } });
    res.render('index', { articles });
})

app.get('/new', (req, res) => {
    res.render('new');
})

app.post('/', (req, res) => {
    const article = req.body;
    article.title = article.title.toUpperCase();
    article.id = uuidv4();
    Article.create(article);
    res.redirect('/');
})

app.get('/:articleid', async(req, res) => {
    const articleid = req.params;
    let article = await Article.find({ id: articleid.articleid });
    article = article[0];
    res.render('show', { article });
})

app.get('/:articleid/edit', async(req, res) => {
    const articleid = req.params;
    let article = await Article.find({ id: articleid.articleid });
    article = article[0];
    res.render('edit', { article });
})


app.patch('/:articleid', async(req, res) => {
    const { articleid } = req.params;
    console.log(articleid);
    await Article.updateOne({ id: articleid }, { $set: { title: req.body.title, description: req.body.description, markdown: req.body.markdown, date: Date.now() } });
    res.redirect(`/${articleid}`);
})


app.delete('/:articleid', async(req, res) => {
    const { articleid } = req.params;
    await Article.deleteOne({ id: articleid });
    res.redirect('/');
})


app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})