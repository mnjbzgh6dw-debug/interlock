import { Route, Routes } from 'react-router-dom'
import Register from './routes/Register'
import LiftDetail from './routes/LiftDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/lift/:liftId" element={<LiftDetail />} />
    </Routes>
  )
}
