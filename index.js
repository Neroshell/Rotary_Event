require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require("express-session");
const User = require('./userModel');
const mealTicket = require('./meal_ticketModel');
const socketIo = require('socket.io');
const http = require('http');
const Admin = require('./adminModel');
const crypto = require('crypto');
const { sendEmail, generateRandomCode } = require('./emailService');
const flash = require('express-flash');

const server = http.createServer(app);
const io = socketIo(server);

const dbPass = process.env.DB_PASS;
mongoose.connect(`mongodb+srv://Nero:${dbPass}@atlascluster.dn1h6uq.mongodb.net/rotary_event`, { useUnifiedTopology: true });



mongoose.connection.on('connected', function () {
    console.log('Database connection has been established');
});

mongoose.connection.on('error', function (err) {
    console.error(' Err! Database could not connect:', err);
});


// view engine setup

app.set('view engine', 'ejs');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  app.use(flash());

app.use(express.static("public"));
app.use('/admin-dashboard', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());


app.get('/', function(req, res) {

    res.render('index');

});


app.post('/', async function(req, res) {
    try {
        const { title, firstname, lastname, email, calname, clubname, phonenumber } = req.body;

        // Generate a random alphanumeric code with exactly 5 characters
        const generatedCode = generateRandomCode(5);

        const newUser = new User({
            title,
            firstname,
            lastname,
            email,
            calname,
            clubname,
            phonenumber,
            eventCode: generatedCode // Save the code to the uniqueCode field
        });
            const found = await User.findOne({ email: email});

            if (found){

                req.flash('error', 'User already exists, try a new email');
                return res.redirect('/');
            }
        const savedUser = await newUser.save();
        if (savedUser) {
            // Send the code to the user's email using the separate function
            sendEmail(email, generatedCode);

            await User.updateOne({}, { $inc: { count: 1 } });
            res.render('registered');
           
        } else {
            res.status(500).send({ error: 'Internal Server Error' });
        }

        // Continue with any other operations or send a response...
        
    } catch (error) {
        console.error('Error saving user:', error);
        // Handle the error and send an appropriate response...
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/register', function(req, res) {

        res.render('registered');

});

app.get('/admin_signup', function(req, res) {

    res.render('admin_signup');

});


app.post('/admin_signup', function(req, res) {

    const newAdmin = new Admin({
        firstname: req.body.firstname,
        email: req.body.email,
        
    });

    Admin.register(newAdmin, req.body.password, (err, registered) => {
        if (registered) {
            passport.authenticate('local')(req, res, function (err) {
                if (err) {
                    console.error(err);
                    return res.redirect("/"); // Redirect to signup page or handle as needed
                }

                res.redirect("admin_login");
            })
        } else {
            console.error(err);
            res.render("admin_signup"); // Render the signup page again or handle the error appropriately
        }
    })
});





app.get('/admin_login', function(req, res) {

    res.render( 'admin_login');

});

app.post('/admin_login', function(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            console.error(err);
            return next(err);
        }

        if (!user) {
            // Authentication failed
            req.flash('error', 'Authentication failed, User does not exist in our database');
            return res.redirect('/admin_login');
        }

        // Authentication succeeded
        req.logIn(user, function (err) {
            if (err) {
                console.error(err);
                return next(err);
            }
            req.flash('success', 'Authentication sucessful');
            return res.redirect('/admin-dashboard');
        });
    })(req, res, next);

});

app.get('/admin-dashboard', async function(req, res) {
    try {
        // Fetch any user document to get the count value
        const userDocument = await User.findOne();
         const mealNumber = await mealTicket.findOne();

        // Extract the count value from the user document or default to 0
        const count = userDocument ? userDocument.count : 0;
        const foodCount = mealNumber ? mealNumber.mealCount : 0;

        if (req.isAuthenticated()) {
            res.render('admin_dashboard', { count: count, foodCount: foodCount });
        } else {
            res.redirect('/admin_login');
        }
    } catch (error) {
        console.error('Error fetching count from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
;

app.get('/admin-dashboard/register_meal', function(req, res) {

    res.render( 'register_meal');

});


app.post('/admin-dashboard/register_meal', async function(req, res) {
    try {
        const code = req.body.code;

        // Find the user based on the provided code
        const user = await User.findOne({ eventCode: code });
      
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

       

        // Access the user's data
        const userFirstName = user.firstname;
        const userLastName = user.lastname;
        const uniqueCode = user.eventCode;

        const currentDate = new Date();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const nowTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        const todaysDate = currentDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });

        // Create a new MealTicket for the user
        let meal = new mealTicket({
            userId: user._id,
            firstname: userFirstName,
            lastname: userLastName,
            eventCode: uniqueCode,
            ateAt: nowTime,
            ateOn: todaysDate
            
        });

        // Save the new Mealticket
        const savedMealTicket = await meal.save();

        if (savedMealTicket) {
            
            await mealTicket.updateOne({}, { $inc: { mealCount: 1 } });
            res.redirect('/admin-dashboard/meal_list');
           
          
         
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Error registering meal:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/admin-dashboard/meal_list', async function(req, res) {
    try {
        const mealTickets = await mealTicket.find();

        res.render('mealTicket', { meals: mealTickets });
    } catch (error) {
        console.error('Error fetching meal tickets from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/admin-dashboard/search', async function(req, res) {
    try {
        const eventCode = req.query.code;

     // Query the database for meal records matching the unique code
        const mealRecords = await mealTicket.find({ eventCode });
      

        // Return the search results as JSON
        res.render("meal_query", {meals: mealRecords});
    } catch (error) {
        console.error('Error searching meal records:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.get('/admin-dashboard/list', async function(req, res) {
    try {
        // Fetch all users from the database
        const allUsers = await User.find();

        // Render the 'list' template with the user list
        res.render('list', { users: allUsers });
    } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle the error and send an appropriate response...
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/logout', function(req, res) {
    req.logout(function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/'); // Redirect to the home page 
      });

   

});



 app.listen(port, () => {

    console.log('listening on port 4000');
 });
