# loc8r
Learning MEAN stack with "Getting MEAN with Mongo, Express, Angular, and Node" by Simon Holmes.

The app is currently deployed onto Heroku https://learnmean.herokuapp.com/ and connected with mLab MongoDB.
#### What I have learned:
######Node:
1. use npm to install and manage Node packages with package.json

######Express:
1. Use Jade node template engine for views http://jade-lang.com/. Seperate common Jade javascrip function into _include folder
2. Use nodemon to automatically restart Express app
3. Use app.use in app.js for routing
4. Use app.set to make REST API json response looks nice
5. Build static site. Then, connect views and controllers with routes to create VC model
6. Create REST API and test with Chrome app Postman

######MongoDB:
1. Set up MongoDB as service in Windows 8.1
2. Use Mongoose to define schemas for a data model
3. Use mongo shell

######Heroku:
1. Use mLab MongoDB add-ons and connect app to production DB.
2. Deploy app onto Heroku along with Procfile.

#### List of questions I have:
1. What are middleware in Express written in app.js? The lines start with app.use
2. What are other things I can use with app.set?
3. Can Jade template connect with Reactjs?
4. What are callbacks and scopes of Javascrip? Why are they important? How do I practice?
5. What would (!undefined) be evaluated? Would it be true?
6. What would req.params && req.params.locationid be evaluated? In console, there are [object Object] with undefined or a string
7. MongoDB: how do I easily insert, update and delete data without directly type in mongo shell? 

#### Road map of the app:
1. Finish up loc8r
2. Play with other features of Express
3. Play with other features of Node.js
4. Use Reactjs instead of Angularjs

#### Bugs I faced and learn how to resolve:
1. Mongoose subdoc find id is not working -> check out the JSON again and the id should be writTen as "_id" and not just "id"