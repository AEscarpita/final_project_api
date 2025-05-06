const express = require('express');
const app = express();
const verifyStates = require('../../middleware/verifyStates.js')
const router = express.Router();
const stateController = require('../../controllers/stateController.js');

router.route('/')
    .get(stateController.getAllStates);

router.use('/:state', verifyStates);
router.route('/:state')
    .get(stateController.getState);

router.use('/:state/capital', verifyStates);    
router.route('/:state/capital')
    .get(stateController.getStateCapital);

router.use('/:state/nickname', verifyStates);  
router.route('/:state/nickname')
    .get(stateController.getStateNickname);

router.use('/:state/population', verifyStates);  
router.route('/:state/population')
    .get(stateController.getStatePopulation);

router.use('/:state/admission', verifyStates);  
router.route('/:state/admission')
    .get(stateController.getStateAdmission);

router.use('/:state/funfact', verifyStates);  
router.route('/:state/funfact')
    .get(stateController.getStateFunFact)
    .post(stateController.createFunFact)
    .patch(stateController.updateFunFact)
    .delete(stateController.deleteFunFact);   
    
module.exports = router;