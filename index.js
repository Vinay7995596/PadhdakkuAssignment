const express = require('express');
const bodyParser = require('body-parser');
const { isEmail } = require('validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory data store (replace with a database in production)
const users = [];
const posts = [];

// User Sign-Up API
app.post('/api/signup', (req, res) => {
    const { name, email } = req.body;

    // Check if the email is already registered
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ statusCode: 400, message: 'Email already registered.' });
    }

    // Validate email format
    if (!isEmail(email)) {
        return res.status(400).json({ statusCode: 400, message: 'Invalid email format.' });
    }

    const RequestBody = { name, email };
    users.push(RequestBody);
    const Endpoint ='POST/api/signup';
    const Response =  '200 : Successful user sign-up.'
    res.status(200).json({ Endpoint, RequestBody, Response });
    // Use status code 201 for resource creation
});

// Create Post API
app.post('/api/posts', (req, res) => {
    const { userId, content } = req.body;
    const user = users.find(user => user.id === userId);
    
    if (!user) {
        return res.status(404).json({ statusCode: 404, message: 'User ID not found.' });
    }

    if (!content) {
        return res.status(400).json({ statusCode: 400, message: 'Content cannot be empty.' });
    }

    const post = { id: Date.now().toString(), userId, content };
    const Endpoint ='POST/api/posts';
    posts.push(post);
    const Response =  '200 OK: Successfully created.'
    res.status(201).json({Endpoint, post, Response });
    // Use status code 201 for resource creation
});


// Delete Post API
app.delete('/api/deletepost/:postId', (req, res) => {
    const postId = req.params.postId;
    const index = posts.findIndex(post => post.id === postId);
    const Endpoint = 'DELETE/api/deletepost/' + postId;

    if (index !== -1) {
        const post = posts[index];

        // Check if the person is authorized to delete the post (e.g., based on user ID)
        if (post.userId !== req.body.userId) {
            return res.status(403).json({ statusCode: 403, message: 'Unauthorized to delete this post.' });
        }

        posts.splice(index, 1);
        const Response = '200 OK: Post deleted successfully.';
        res.status(200).json({ Endpoint, postId, Response });
    } else {
        res.status(404).json({ statusCode: 404, message: 'Post ID not found' });
    }
});


// Fetch User's Posts API
app.get('/api/posts/:userId', (req, res) => {
    const userId = req.params.userId;
    const userPosts = posts.filter(post => post.userId === userId);
    const Endpoint = 'GET/api/posts/' + userId;

    if (!userPosts.length) {
        return res.status(404).json({ statusCode: 404, message: 'No posts found for this user.' });
    }

    res.status(200).json({ Endpoint, userId, posts: userPosts, Response: '200: all the posts from the user' });
});

// If user ID is not found
app.use((req, res, next) => {
    res.status(404).json({ statusCode: 404, message: 'User ID not found.' });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
