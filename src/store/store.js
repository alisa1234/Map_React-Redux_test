import {configureStore} from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";
import func from "./middleware/func";

const preloadedState = localStorage.getItem('locations');
const store = configureStore({
    reducer,
    middleware: [logger, func],
    preloadedState
});

export default store;