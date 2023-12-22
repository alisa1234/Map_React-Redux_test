import * as actions from "./actionTypes";

export default function reducer(state = [], action) {
    switch (action.type) {
        case actions.LOCATION_ADD:
            state = action.payload.localLocations;
            action.payload.localLocations.push({coordinates: [0,0], name: '', key: action.payload.localLocations.length});
            action.payload.editableArr.push(false);
            console.log('add state');
            break;
        case actions.LOCATION_EDIT:
            state = action.payload.localLocations;
            if (!action.payload.isEdit) {
                localStorage.setItem('locations', JSON.stringify(state));
                console.log('edit state', state)
            }
            break;
        case actions.LOCATION_DELETE:
            state = action.payload.localLocations;
            const res = action.payload.localLocations.splice(action.payload.localLocations.length - 1, 1);
            console.log('delete state', state)
            break;
        case actions.LOCATION_SORT:
            state = action.payload.localLocations;
            action.payload.localLocations.sort(function (a, b) {
                if (a.name < b.name) {
                    return action.payload.order === 'ASC' ? -1 : 1;
                }
                if (a.name > b.name) {
                    return action.payload.order === 'ASC' ? 1 : -1;
                }
                return 0;
            });
            console.log('sorted state', state)
            break;
    }
    return state;
}