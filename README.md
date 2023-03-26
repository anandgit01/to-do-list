# Node, EJS, and MySQL To-Do List Application
This is a web application built using Node.js, EJS, and MySQL that allows users to create and manage to-do list items. Users can register for an account, log in, and then view, add, edit, and delete to-do items.

# Requirements
To run this application locally, you will need to have the following installed on your machine:
Item Node.js
Item1 MySQL

# Installation
To install the application, follow these steps:
Copy code to your local machine.
Navigate to the root directory of the project in your terminal.
Run the command npm install to install the required dependencies.
npm install
Set up the MySQL database.
css
Run the command npm start to start the application.
npm start
Open your web browser and navigate to http://localhost:3000 to view the application.
Usage
# To use the application, follow these steps:
Register for an account by clicking on the "Register" link and filling out the registration form.
Log in to your account by clicking on the "Log in" link and entering your username and password.
View your to-do list items on the home page.
Add a new to-do item by entering a description in the "Add a new to-do item" form and clicking the "Add" button.
Delete a to-do item by clicking on the "Delete" button next to the item.

# Database Schema
The application uses a MySQL database with the following tables:
users
Column	Type	Description
id	int	The unique ID of the user
username	varchar(255)	The username of the user
password	varchar(255)	The hashed password of the user
todos
Column	Type	Description
id	int	The unique ID of the to-do item
description	text	The description of the to-do item
completed	boolean	Whether the to-do item is completed or not
user_id	int	The ID of the user who created the to-do item
The users table stores information about registered users, including their username and hashed password.

The todos table stores information about to-do list items, including their description, completion status, and the ID of the user who created the item. The user_id column in the todos table is a foreign key that
# Credits
This application was built by Anand Mathew.	:blush:
