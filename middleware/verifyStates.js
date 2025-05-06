const fsPromises = require('fs').promises;
const path = require('path');

const verifyStates = async (req, res, next) => {

    stateCode = req.params.state;

    req.params.state = req.params.state.toUpperCase();
 
    stateCode = stateCode.toUpperCase();
    
    try{
        const data = await fsPromises.readFile(path.join(__dirname, '..', 'data', 'statesData.json'), 'utf8');
        const statesData = await JSON.parse(data);  
        const stateCodeData = await statesData.map(states => {
            return states.code;
        });
    
        if( await stateCodeData.find((element) => element === stateCode)){
            req.code = stateCode;
            next();
        }else{
            res.json({"message": "Invalid state abbreviaiton parameter"});
        }
            
    } catch (err){
        console.error(err);
    }
    
}


module.exports = verifyStates;