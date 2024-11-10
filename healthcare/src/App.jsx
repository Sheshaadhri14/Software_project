import {BrowserRouter,Routes, Route} from 'react-router-dom'
import Signup from './Componets/Signup'
import Login from './Componets/Login.jsx'
import Home from './Componets/Home'
import ForgotPassword from './Componets/ForgotPassword.jsx'
import ResetPassword from './Componets/ResetPassword.jsx'
import Dashboard from './Componets/Dashboard.jsx'
import UploadHealthDetails from './Componets/UploadHealthDetails.jsx'
import PrivateRoute from './Componets/PrivateRoute.jsx'
import Logout from './Componets/Logout.jsx'
import Verification from './Componets/Verification.jsx'
import PatientDetails from './Componets/PatientDetail.jsx'
import TestIPFSUpload from './Componets/TestIPFSUpload.jsx'


function App() {
 

  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/patientdetails/:id" element={<PatientDetails />}/>
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/upload-health-details" element={<UploadHealthDetails />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/test-ipfs-upload" element={<TestIPFSUpload />} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
