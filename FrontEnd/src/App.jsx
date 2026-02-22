import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar, ComplaintForm, TrackApplication, Footer, Login, Home } from "./Components/index"
import GovernmentNotices from "./Components/Notices/Notices";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={< Home />}></Route>
            <Route path="/services" element={<></>}></Route>
            <Route path="/track-Application" element={<TrackApplication />}></Route>
            <Route path="/complaints" element={<ComplaintForm />}></Route>
            <Route path="/government-notice" element={<GovernmentNotices />}></Route>
            <Route path="/profile" element={<>profile</>}></Route>
            <Route path="/ContactUs" element={<>Contact Us</>}></Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
