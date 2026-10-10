const express = require('express');
const authController = require('../controllers/auth.controller');
const authmiddleware = require('../middlewares/auth.middleware');


/**
 * The primary title of the website.
 * @route POST /api/auth/register
 * @description This route handles user registration.
 *  It accepts user details in the request body and creates a new user in the database.
 * @access Public
 */

const authrouter = express.Router();
authrouter.post('/register', authController.registerUsercontroller);



/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
authrouter.post('/login', authController.loginUserController)


/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
authrouter.get("/logout", authController.logoutUserController)



/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authrouter.get("/get-me", authmiddleware.authUser, authController.getMeController);




module.exports = authrouter;