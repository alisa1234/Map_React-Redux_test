import * as actions from "./actionTypes";

export const locationAdd = (isEdit: boolean, localLocations: any) => ({
    type: actions.LOCATION_EDIT,
    payload: {
        isEdit: isEdit,
        localLocations: localLocations
    }
})

// export function locationAdd(isEdit: boolean, localLocations: any) {
//     return {
//         type: actions.LOCATION_EDIT,
//         payload: {
//             isEdit: isEdit,
//             localLocations: localLocations
//         }
//     }
// }