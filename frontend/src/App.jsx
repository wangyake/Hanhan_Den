import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import StoryLoader from "./components/StoryLoader"
import StoryGenerator from "./components/StoryGenerator.jsx";
import SiteLayout from "./components/SiteLayout.jsx";
import Ai from "./components/Ai.jsx";
import Articles from "./components/Articles.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<SiteLayout />}>
          <Route index element={<Articles />} />
          <Route path={"articles"} element={<Articles />} />
          <Route path={"ai"} element={<Ai />} />
        </Route>
        <Route path={"/adventure"} element={<StoryGenerator />} />
        <Route path={"/story/:id"} element={<StoryLoader />} />
      </Routes>
    </Router>
  )
}

export default App