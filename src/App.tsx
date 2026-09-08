import { Route, Routes } from 'react-router-dom'
import Register from './routes/Register'
import LiftDetail from './routes/LiftDetail'
import InspectionForm from './routes/InspectionForm'
import DefectReview from './routes/DefectReview'
import SignOff from './routes/SignOff'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/lift/:liftId" element={<LiftDetail />} />
      <Route path="/lift/:liftId/inspection" element={<InspectionForm />} />
      <Route path="/lift/:liftId/inspection/defects" element={<DefectReview />} />
      <Route path="/lift/:liftId/inspection/sign-off" element={<SignOff />} />
    </Routes>
  )
}
