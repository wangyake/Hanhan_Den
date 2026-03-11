import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import StoryLoader from "./components/StoryLoader"
import StoryGenerator from "./components/StoryGenerator.jsx";
import SiteLayout from "./components/SiteLayout.jsx";
import Ai from "./components/Ai.jsx";
import Articles from "./components/Articles.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminArticles from "./components/AdminArticles.jsx";
import AdminGalleries from "./components/AdminGalleries.jsx";
import AdminGames from "./components/AdminGames.jsx";
import AuthGuard from "./components/AuthGuard.jsx";

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
        <Route path={"/admin/login"} element={<AdminLogin />} />
        <Route path={"/admin"} element={<AuthGuard />}>
          <Route index element={<AdminLayout><AdminArticles /></AdminLayout>} />
          <Route path={"articles"} element={<AdminLayout><AdminArticles /></AdminLayout>} />
          <Route path={"galleries"} element={<AdminLayout><AdminGalleries /></AdminLayout>} />
          <Route path={"games"} element={<AdminLayout><AdminGames /></AdminLayout>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App