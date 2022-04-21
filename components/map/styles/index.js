import {fromJS} from 'immutable'

import orthoStyle from '@/components/map/styles/ortho.json'
import vectorStyle from '@/components/map/styles/vector.json'
import planIGNStyle from '@/components/map/styles/plan-ign.json'

export const ortho = fromJS(orthoStyle)
export const vector = fromJS(vectorStyle)
export const planIGN = fromJS(planIGNStyle)
