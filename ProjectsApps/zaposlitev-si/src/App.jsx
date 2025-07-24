import { Routes, Route } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MessageProvider } from './context/MessageContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import EditJob from './pages/EditJob';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Messages from './pages/Messages';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <MessageProvider>
                    <JobProvider>
                        <div className="App">
                            <Navigation />
                            <main>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route
                                        path="/job/:id"
                                        element={<JobDetail />}
                                    />
                                    <Route
                                        path="/post-job"
                                        element={<PostJob />}
                                    />
                                    <Route
                                        path="/edit-job/:id"
                                        element={<EditJob />}
                                    />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route
                                        path="/register"
                                        element={<Register />}
                                    />
                                    <Route
                                        path="/messages"
                                        element={<Messages />}
                                    />
                                </Routes>
                            </main>
                        </div>
                    </JobProvider>
                </MessageProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
