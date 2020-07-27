import {fromJS} from 'immutable'

import orthoStyle from './ortho'
import vectorStyle from './vector'
import vectorCadastreStyle from './vector-cadastre'

export const ortho = fromJS(orthoStyle)
export const vector = fromJS(vectorStyle)
export const vectorCadastre = fromJS(vectorCadastreStyle)
