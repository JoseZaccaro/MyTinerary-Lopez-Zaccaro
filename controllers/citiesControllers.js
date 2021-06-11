const City = require('../models/City') 

const citiesControllers = {

    allCities: async (req,res)=>{
        try{
            const allCities = await City.find()
            res.json({success:true, response: allCities})
        }catch(error){
            res.json({success:false, response:"Error it was not possible to obtain the cities."})
        }
    },

    findCity: async (req,res)=>{
        const id = req.params.id    
        try{
            const findedCity = await City.findById(id)
            res.json({success:true, response:findedCity})
        }catch(error){
            res.json({success:false, response:"Error '_id' of city not valid."})
        }
    },

    postCity: async (req,res)=>{
        try{
            new City(req.body).save()
            const allCities = await City.find()
            res.json({success:true, response:allCities })
        }catch(error){
            res.json({success:false, response:"Error, it was not possible to save this city."})
        }
    },
    modifyCity: async (req, res)=> {
        const cityToModify = req.params.id
        const propsToModify = req.body
        try{
            const modifiedCity = await City.findOneAndUpdate({_id: cityToModify},{...propsToModify},{new:true})
            res.json({success:true, response:modifiedCity})

        }catch(error){
            res.json({success:false,response:"Error when modifiying city."})
        }
    },
    deleteCity: async (req,res)=>{
        const cityToDelete = req.params.id
        try{
            await City.findOneAndDelete({_id:cityToDelete})
            const allCities = await City.find()
            res.json({success:true, response:allCities})
        }catch(error){
            res.json({success:false, response:"Error deleting city."})
        }
    }
}

module.exports = citiesControllers