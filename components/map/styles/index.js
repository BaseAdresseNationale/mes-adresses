import {fromJS} from 'immutable'

import orthoStyle from './ortho.json'
import vectorStyle from './vector.json'
import planIGNStyle from './plan-ign.json'

export const ortho = fromJS(orthoStyle)
export const vector = fromJS(vectorStyle)
export const planIGN = fromJS(planIGNStyle)
