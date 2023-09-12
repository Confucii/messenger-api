# Blog API

This project is a comprehensive blogging system consisting of three main parts: a RESTful API, a client-side application, and a content management system (CMS) for administrators. It allows admins to create, read, update, and delete blog posts, submit comments, and manage blog content efficiently.

### [Client Live Demo](https://confucii-blog-client.netlify.app/)

### [CMS](https://github.com/Confucii/blog-cms)

### [Client Repo](https://github.com/Confucii/blog-client)

![Client layout image](https://raw.githubusercontent.com/Confucii/confucii/main/images/client.gif)

![CMS layout image](https://raw.githubusercontent.com/Confucii/confucii/main/images/cms.gif)

## Description

The Blog API is the backbone of the entire system, responsible for handling data related to users, posts, and comments. It is built using MongoDB as the database and Express.js as the server framework. The API employs the following key features:

#### Data Models:

There are three primary data models within the API - user, post, and comment. The comment model is linked to the post model through a reference to the post's unique identifier. This relationship allows comments to be associated with specific posts.

#### Data Validation:

Input data is validated using the express-validator library to ensure data integrity and security.

#### User Authentication:

Users that are logged in will receive a JWT token, allowing to maintain persistent access. Notably, only the Content Management System (CMS) allows users to login; client-side users cannot log in.

#### Authorization:

For protected routes, JWT token received with request cookies are verified to determine if user has access.

#### API Endpoints:

The API supports various endpoints for performing CRUD (Create, Read, Update, Delete) operations on posts and comments, including the ability to get, submit, update, and delete posts individually, and retrieve all posts. Users can also create, retrieve, and delete comments.

## Technologies used

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="30" height="30"/><img src="https://raw.githubusercontent.com/devicons/devicon/1119b9f84c0290e0f0b38982099a2bd027a48bf1/icons/express/express-original.svg" alt="express" width="30" height="30"/><img src="https://raw.githubusercontent.com/devicons/devicon/1119b9f84c0290e0f0b38982099a2bd027a48bf1/icons/nodejs/nodejs-original.svg" alt="nodeJS" width="30" height="30"/> <img src="https://raw.githubusercontent.com/devicons/devicon/1119b9f84c0290e0f0b38982099a2bd027a48bf1/icons/mongodb/mongodb-original-wordmark.svg" alt="MongoDB" width="30" height="30"/>

> AI generated humor: <br>
> Q: Tell me a joke about backend authorization <br>
> A: Why did the backend authorization system go to therapy? <br>
> Because it had too many issues with trust and kept denying access to its feelings!
