const State = require('../model/State.js');
const express = require('express');
const app = express();
const fsPromises = require('fs').promises;
const path = require('path');


try{
    
    const getAllStates = async (req, res) =>{
        const data = await fsPromises.readFile(path.join(__dirname, '..', 'data', 'statesData.json'), 'utf8');
        const statesData = await JSON.parse(data);  
        const Statesfunfacts = await State.find();
   
        await statesData.forEach(states => {
            for(i = 0; i < Statesfunfacts.length; i++){
                if(states.code === Statesfunfacts[i].stateCode){
                        states.funfacts = Statesfunfacts[i].funFacts;
                 
                }
            } 
        });

        if(req.query.contig === undefined){
            
            res.json(statesData);
        } else if(req.query.contig === "true"){
            const statesContig = await statesData.filter(states => {
                return states.admission_number < 49;
            });

            res.json(statesContig);

        }else if(req.query.contig === "false"){
            const statesNonContig = await statesData.filter(states => {
                return states.admission_number >= 49;
            });
           res.json(statesNonContig);
        }
        
    }

    const getState = async (req, res) =>{
        const data = await fsPromises.readFile(path.join(__dirname, '..', 'data', 'statesData.json'), 'utf8');
        const statesData = await JSON.parse(data);
        const Statesfunfacts = await State.find();
        await statesData.forEach(states => {
            for(i = 0; i < Statesfunfacts.length; i++){
                if(states.code === Statesfunfacts[i].stateCode){
                        states.funfacts = Statesfunfacts[i].funFacts;
                 
                }
            } 
        });
        stateCode = req.code;
        let selectedState = await statesData.filter(states => {
            return states.code === stateCode;
        });

        selectedState = selectedState[0];

        res.json(selectedState); 

    }

    const getStateCapital = async (req, res) =>{
        const data = await fsPromises.readFile(path.join(__dirname, '..', 'data', 'statesData.json'), 'utf8');
        const statesData = await JSON.parse(data);
        
        stateCode = req.code;
        let selectedState = await statesData.filter(states => {
            return states.code === stateCode;
        });

        selectedState = selectedState[0];

        res.json({"state": selectedState.state, "capital": selectedState.capital_city});
        
    }

    const getStateNickname = async(req, res) =>{
        const data = await fsPromises.readFile(path.join(__dirname, '..', 'data', 'statesData.json'), 'utf8');
        const statesData = await JSON.parse(data);
    
        stateCode = req.code;
        let selectedState = await statesData.filter(states => {
            return states.code === stateCode;
        });

        selectedState = selectedState[0];

        res.json({"state": selectedState.state, "nickname": selectedState.nickname});

    }

    const getStatePopulation = async(req, res) =>{
        const data = await fsPromises.readFile(path.join(__dirname, '..', 'data', 'statesData.json'), 'utf8');
        const statesData = await JSON.parse(data);

        stateCode = req.code;
        let selectedState = await statesData.filter(states => {
            return states.code === stateCode;
        });

        selectedState = selectedState[0];

        res.json({"state": selectedState.state, "population": selectedState.population.toLocaleString()});
    }

    const getStateAdmission = async(req, res) =>{
        const data = await fsPromises.readFile(path.join(__dirname, '..', 'data', 'statesData.json'), 'utf8');
        const statesData = await JSON.parse(data);
        
        let selectedState = await statesData.filter(states => {
            return states.code === req.code;
        });

        selectedState = selectedState[0];

        res.json({"state": selectedState.state, "admitted": selectedState.admission_date});
    }

    const getStateFunFact = async (req, res) =>{
        const data = await fsPromises.readFile(path.join(__dirname, '..', 'data', 'statesData.json'), 'utf8');
        const statesData = await JSON.parse(data);
        const Statesfunfacts = await State.find();
        await statesData.forEach(states => {
            for(i = 0; i < Statesfunfacts.length; i++){
                if(states.code === Statesfunfacts[i].stateCode){
                        states.funfacts = Statesfunfacts[i].funFacts;
                 
                }
            } 
        });

        stateCode = req.code;
        let selectedState = await statesData.filter(states => {
            return states.code === stateCode;
        });

        selectedState = selectedState[0];
        
        if(selectedState.funfacts){

            randNum = Math.floor(Math.random() * (selectedState.funfacts.length));
            res.json({"funfact": selectedState.funfacts[randNum]});
            
        }else{
            res.json({"message": `No Fun Facts found for ${selectedState.state}`})
        }
        

        
    }

    //const createFunFact = async (req, res) =>{
        //selectedStateCode = req.code;
        //if(!req?.body?.funfacts || !Array.isArray(req.body.funfacts)){
            //return res.status(400).json({'message': 'funfacts are required and must be an array'});
        //}

        //const selectedState = await State.findOne({stateCode: selectedStateCode}).exec();

        //if(selectedState){

           //let newFunfactArray =  selectedState.funFacts.concat(req.body.funfacts);

           //selectedState.funFacts = newFunfactArray;
            //const result = await selectedState.save();
            //res.status(201).json(result);

        //}else{

            //try{
                //console.log(req.body.funfacts);
                //const result = await State.create({
                    //stateCode: selectedStateCode,
                    //funFacts: req.body.funfacts
                //});

                //res.status(201).json(result)

            //}catch (err){
                //console.error(err);
            //}

        //}


        
    //}

    const createFunFact = async (req, res) =>{
        let selectedStateCode = req.code;
        if(!req?.body?.funfacts){
            return res.json({'message': 'State fun facts value required'});
        }else if (!Array.isArray(req.body.funfacts)){
          return res.json({'message': 'State fun facts value must be an array'})
        }
      
        let newFunFacts = req.body.funfacts;

        const selectedState = await State.findOne({stateCode: selectedStateCode}).exec();

        if(selectedState){
          
          for(let i = 0; i < newFunFacts.length; i++){
            
            selectedState.funFacts.push(newFunFacts[i]);
            
          }
            
            const result = await selectedState.save();
            res.json(result);

        }else{

            try{
                const result = await State.create({
                    stateCode: selectedStateCode,
                    funFacts: newFunFacts
                });

                res.json(result)

            }catch (err){
                console.error(err);
            }

        }


        
    }

    //const updateFunFact = async (req,res) =>{
        //selectedStateCode = req.code;
        //if(!req?.body?.funfact){
            //return res.status(400).json({'message': 'A funfact is required'});
        //}
        //if(!req?.body?.index || !req.body.index > 0){
            //return res.status(400).json({'message': 'index is required and must not be 0'});
        //}

        //const selectedState = await State.findOne({stateCode: selectedStateCode}).exec();  

        //if(!selectedState){
           // return res.status(400).json({'message': 'State does not have funfacts '});
        //}else if (!selectedState.funFacts[req.body.index - 1]){
            //return res.status(400).json({'message': 'State does not have a funfact in that position'});
        //}else{
            //selectedState.funFacts[req.body.index - 1] = req.body.funfact;
            //const result = await selectedState.save();
            //res.json(result);
        //}
        
    //}

    const updateFunFact = async (req,res) =>{
        const data = await fsPromises.readFile(path.join(__dirname, '..', 'data', 'statesData.json'), 'utf8');
        const statesData = await JSON.parse(data);
        let selectedStateCode = req.code;
      
        let selectedStateInfo = await statesData.filter(states => {
            return states.code === selectedStateCode;
        });

        selectedStateInfo = selectedStateInfo[0];
        
        
      
        if(!req?.body?.funfact){
            return res.status(400).json({'message': 'State fun fact value required'});
        }
        if(!req?.body?.index){
            return res.status(400).json({'message': 'State fun fact index value required'});
        }
      
        let funfact = req.body.funfact;
      
        let index = req.body.index - 1; 

        console.log(index);

        const selectedState = await State.findOne({stateCode: selectedStateCode}).exec();  

        if(!selectedState){
            return res.status(400).json({'message': `No Fun Facts found for ${selectedStateInfo.state}`});
        }else if (!selectedState.funFacts[index]){
            return res.status(400).json({'message': `No Fun Fact found at that index for ${selectedStateInfo.state}`});
        }
          selectedState.funFacts[index] = funfact;
          const result = await selectedState.save();
          res.json(result);
        
        
    }

    //const deleteFunFact =  async (req, res) =>{
        //selectedStateCode = req.code;
        //if(!req?.body?.index || !req.body.index > 0){
            //return res.status(400).json({'message': 'index is required and must not be 0'});
        //}

        //const selectedState = await State.findOne({stateCode: selectedStateCode}).exec();  

        //if(!selectedState){
            //return res.status(400).json({'message': 'State does not have funfacts '});
        //}else if (!selectedState.funFacts[req.body.index - 1]){
            //return res.status(400).json({'message': 'State does not have a funfact in that position'});
        //}else{
            
            //let funfactToRemove = selectedState.funFacts[req.body.index - 1]
            //let newfunfactArray = await selectedState.funFacts.filter(funfact => {
                //return funfact != funfactToRemove;
            //});

            //selectedState.funFacts = newfunfactArray;

            //const result = await selectedState.save();
            //res.json(result);
        //}
    //}   

        const deleteFunFact =  async (req, res) =>{
            const data = await fsPromises.readFile(path.join(__dirname, '..', 'data', 'statesData.json'), 'utf8');
            const statesData = await JSON.parse(data);
            let selectedStateCode = req.code;
          
            let selectedStateInfo = await statesData.filter(states => {
                return states.code === selectedStateCode;
            });
    
            selectedStateInfo = selectedStateInfo[0];
            
          
            if(!req?.body?.index){
                return res.status(400).json({'message': 'State fun fact index value required'});
            }
          
            let index = req.body.index - 1; 
          
    
            const selectedState = await State.findOne({stateCode: selectedStateCode}).exec();   

            if(!selectedState){
                return res.status(400).json({'message': `No Fun Facts found for ${selectedStateInfo.state}`});
            }else if (!selectedState.funFacts[index]){
                return res.status(400).json({'message': `No Fun Fact found at that index for ${selectedStateInfo.state}`});
            }
                
            let funfactToRemove = selectedState.funFacts[index]
            let newfunfactArray = await selectedState.funFacts.filter(funfact => {
                return funfact != funfactToRemove;
            });
    
            selectedState.funFacts = newfunfactArray;
    
            const result = await selectedState.save();
            res.json(result);
            
        
        }
    
    

    module.exports = {
        getAllStates,
        getState,
        getStateCapital,
        getStateNickname,
        getStatePopulation,
        getStateAdmission,
        getStateFunFact,
        createFunFact,
        updateFunFact,
        deleteFunFact
    }

} catch (err){
    console.error(err);
}
