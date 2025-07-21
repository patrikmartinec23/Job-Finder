import { Routes, Route } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
    return (
        <AuthProvider>
            <JobProvider>
                <div className="App">
                    <Navigation />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/job/:id" element={<JobDetail />} />
                            <Route path="/post-job" element={<PostJob />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Routes>
                    </main>
                </div>
            </JobProvider>
        </AuthProvider>
    );
}

export default App;
