import express from 'express'
import {addOrder} from '../controller/integration'

const router = express.Router()

router.post('/', addOrder);
// IF: the External System generates lots of messages with unknown types
// Solution1 : Ban Intenet Protocol addresses that are spamming to Integration Layer
// Solution2 : Set a given time speed request. For example set time speed request is 5ms/ request.
//             If someone is trying to send requests with faster than 5ms (2-3ms). The request is 
//             automaticly refused and return false response

export default router;