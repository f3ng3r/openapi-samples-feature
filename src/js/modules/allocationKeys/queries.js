import _ from 'lodash';
import {
    createAllocationKey,
} from 'src/js/utils/api';
import { doWithLoader } from 'src/js/utils/global';

export function postAllocationKey(allocationKey, props, cb) {
    doWithLoader(props, _.partial(createAllocationKey, props.accessToken, allocationKey), (result) => cb(result));
}
