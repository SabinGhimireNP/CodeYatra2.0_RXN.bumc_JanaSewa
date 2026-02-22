import { BrowserRouter, Routes, Route } from "react-router-dom";
import {NavBar,ComplaintForm, TrackApplication, Footer,Login} from "./Components/index"
import GovernmentNotices from "./Components/Notices/Notices";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<>Home</>}></Route>
        <Route path="/services" element={<></>}></Route> 
        <Route path="/track-Application" element={<TrackApplication/>}></Route>
        <Route path="/complaints" element={<ComplaintForm/>}></Route>
        <Route path="/government-notice" element={<GovernmentNotices/>}></Route>
        <Route path="/profile" element={<>profile</>}></Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
