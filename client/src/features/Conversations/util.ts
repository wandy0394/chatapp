import {v4 as uuidv4} from 'uuid'

export function createTemporaryUUID():string {
    const uuid = uuidv4()
    return 'temp-'+uuid
}