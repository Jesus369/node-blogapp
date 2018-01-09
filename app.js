const mustacheExpress = require('mustache-express')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const mongo = require('mongodb')
const app = express()

mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('mustache',mustacheExpress())
app.use('/public', express.static('public'))
app.use(methodOverride("_method"))
app.set('views','./views')
app.set('new', '/new')
app.set('show', '/show')
app.set('edit', '/edit')
app.set('view engine','mustache')


// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title : String,
	author: String,
	image : String,
	body : String,
	created : {type: Date, default: Date.now()}
})
var Blog = mongoose.model("Blog", blogSchema)

// RESTFUL ROUTES
app.get('/', (req,res) => {
	res.redirect('/blogs')
})

// INDEX ROUTE
app.get('/blogs', (req,res) => {
	// RETRIEVE BLOGS FROM DATABASE
	Blog.find({}, (err,blogs) =>{
		if(err){
			console.log("ERROR!")
		} else {
			res.render('views', {blogs: blogs})
		}
	})
})

// NEW ROUTE
app.get('/blogs/new', (req,res) => {
	res.render('new')
})

// CREATE ROUTE
app.post('/blogs', (req,res) => {
	var blog = new Blog()
	blog.title = req.body.title
	blog.author = req.body.author
	blog.image = req.body.image
	blog.body = req.body.body

	blog.save( (err, newBlog) => {
		if(err) {
			res.render('new')
		} else {
			res.redirect('/blogs')
		}
	})
})

// SHOW ROUTE
app.get('/blogs/:id', (req,res) => {
	Blog.findById(req.params.id, (err,foundBlog) => {
		if(err) {
			res.redirect('/blogs')
		} else {
			res.render('show', {blog:foundBlog})
		}
	})
})

// EDIT ROUTE
app.get('/blogs/:id/edit', (req,res) => {
	Blog.findById(req.params.id, (err,foundBlog) => {
		if(err) {
			res.redirect('/blogs')
		} else {
			res.render('edit', {blog: foundBlog})
		}
	})
})

// UPDATE ROUTE
app.put('/blogs/:id?', (req,res) => {
	Blog.findByIdAndUpdate(req.params.id,
	{$set: {
	title : req.body.title,
	author : req.body.author,
	image : req.body.image,
	body : req.body.body		
} }, (err,updatedBlog) => {
		if(err) {
			res.send("")
		} else {
			res.redirect('/blogs/'+req.params.id)
		}
	})
})

// DELETE ROUTE



app.listen(3000, () => {
	console.log('We are live on port 3000!')
})