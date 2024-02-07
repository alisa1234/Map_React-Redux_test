import React, {useEffect, useState} from "react";
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./Header/Header";
import Map from "./Map/Map";
import {getLocationsLocal} from "./services/location-service";
import Table from "./Table/Table";

function App() {
  const [data, setData] = useState(new Array<any>());
  useEffect(() => {
    if (!getLocalData().length) {
      getLocationsLocal()
              .then(() => setData(getLocalData()))
    }
    if (!!getLocalData().length) {
      setData(getLocalData());
    }
  }, [])
  function getLocalData(): Array<any> {
    const locations = localStorage.getItem('locations');
    return locations ? JSON.parse(locations) : [];
  }
  return (
          <>
            <BrowserRouter>
              <Header></Header>
              <Routes>
                <Route path='/' element={<Map/>}></Route>
                <Route path='/table' element={<Table data={data}/>}></Route>
              </Routes>
            </BrowserRouter>
          </>
  );
}

export default App;
