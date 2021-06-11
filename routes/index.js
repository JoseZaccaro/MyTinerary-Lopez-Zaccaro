const express = require('express')
const router = express.Router()
const citiesControllers = require('../controllers/citiesControllers')
const itinerariesControllers = require('../controllers/itinerariesControllers')
const authControllers = require('../controllers/authControllers')
const activitiesControllers = require('../controllers/activitiesControllers')
const validator = require('../config/validator')
const configValidator = require('../config/configValidator')
const passport = require('../config/passport')
const {getAllActivities, getActivitiesOfItineraryId,postActivity} = activitiesControllers
const {allCities, findCity, postCity, modifyCity, deleteCity} = citiesControllers
const {allItineraries, findItinerary, findItinerariesByCities, postItinerary, modifyItinerary, deleteItinerary, getComments, postComment, editOrDeleteComment, deleteAllComments, likeOrDislike} = itinerariesControllers
const {signUpUser, signInUser, signInLS, getUser, userUpdate} = authControllers

router.route("/cities")
.get(allCities)
.post(postCity)

router.route("/city/:id")
.get(findCity)
.put(modifyCity)
.delete(deleteCity)

router.route("/itineraries")
.get(allItineraries)
.post(postItinerary)

router.route("/itineraries/:idCity")
.get(findItinerariesByCities)

router.route("/itinerary/:id")
.get(findItinerary)
.put(modifyItinerary)
.delete(deleteItinerary)

router.route("/comments/:id")
.get(getComments)
.post(passport.authenticate('jwt',{session: false}),postComment)
.put(passport.authenticate('jwt',{session:false}),editOrDeleteComment)

router.route("/auth/signIn")
.post(signInUser)

router.route("/auth/signUp")
.post(validator, signUpUser)

router.route("/auth/signInLS")
.get(passport.authenticate('jwt',{session: false}), signInLS)

router.route("/auth/user")
.post(getUser)

router.route("/auth/userUpdate")
.put(configValidator ,userUpdate)

router.route("/activities")
.get(getAllActivities)
.post(postActivity)

router.route("/activity/:id")
.get(getActivitiesOfItineraryId)

router.route("/like/:id")
.put(likeOrDislike)

module.exports = router



