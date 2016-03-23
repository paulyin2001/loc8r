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
6. Create REST API and test with Chrome app Postman. Use Postman "x-www-form-urlencoded" body type to test POST API

######MongoDB, Mongoose:
1. Set up MongoDB as service in Windows 8.1
2. Use Mongoose to define schemas for a data model
3. Use mongo shell
4. Use Mongoose to create GET, POST, PUT REST API
5. Use geoNear, geoJSON to calculate distance

######Heroku:
1. Use mLab MongoDB add-ons and connect app to production DB.
2. Deploy app onto Heroku along with Procfile.

######Javascript:
1. "!null" will be evaluated as true.

#### List of questions I have:
1. What are middleware in Express written in app.js? The lines start with app.use
2. What are other things I can use with app.set?
3. Can Jade template connect with Reactjs?
4. What are callbacks and scopes of Javascrip? Why are they important? How do I practice?
5. What would (!undefined) be evaluated? Would it be true?
  * Answer: Yes it will be true. [javascript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#Falsy_values)
6. What would req.params && req.params.locationid be evaluated? In console, there are [object Object] with undefined or a string
  * Answer: As long as it is undefined, it will be evaluated as false
7. MongoDB: how do I easily insert, update and delete data without directly type in mongo shell?
8. What is Modular Javascript? How to write one?
9. How do I have test driven developmet with Nodejs to test every single function I create?
10. What is a returned object parameter in Javascript function?
  * Answer: it is like a variable will certainly be returned. Kind of like a pointer be overwritten in C.
11. What is "parseInt( total / count, 10)" in Javascript?
  * Answer: see [javascript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)
12. After using PUT REST API, the location has one more path "__v". What is this?

#### Road map of the app:
1. Finish up loc8r
2. Play with other features of Express
3. Play with other features of Node.js
4. Use Reactjs instead of Angularjs

#### Hard bugs I faced and learn how to resolve:
1. Mongoose subdoc find id is not working
  * Solution: check out the JSON again and the id should be written as "_id" and not just "id"
2. DELETE REST API error: Can't set headers after they are sent. It does delete review, but the error put a hold on the server.
  * Solution: call sendJsonResponse twice and update res.status twice. Make sure only 1 res being sent. [reference](http://stackoverflow.com/questions/7042340/node-js-error-cant-set-headers-after-they-are-sent)
3. No "API lookup error" shows.
  * Solution: condition (!x instanse of Array) should be written as (!(x instance of Array)) to check whether x is Array