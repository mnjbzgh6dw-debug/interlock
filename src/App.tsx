import { Route, Routes } from 'react-router-dom'
import { DemoControls } from './components/DemoControls'
import Register from './routes/Register'
import LiftDetail from './routes/LiftDetail'
import InspectionForm from './routes/InspectionForm'
import DefectReview from './routes/DefectReview'
import SignOff from './routes/SignOff'
import Report from './routes/Report'
import Distribution from './routes/Distribution'
import Verify from './routes/Verify'
import Worklist from './routes/Worklist'
import DefectDetail from './routes/DefectDetail'
import Landing from './routes/Landing'
import Portfolio from './routes/Portfolio'
import LiftByNumber from './routes/LiftByNumber'
import Stickers from './routes/Stickers'
import NotFound from './routes/NotFound'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/worklist" element={<Worklist />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/l/:officialNumber" element={<LiftByNumber />} />
        <Route path="/stickers" element={<Stickers />} />
        <Route path="/defect/:defectId" element={<DefectDetail />} />
        <Route path="/lift/:liftId" element={<LiftDetail />} />
        <Route path="/lift/:liftId/inspection" element={<InspectionForm />} />
        <Route path="/lift/:liftId/inspection/defects" element={<DefectReview />} />
        <Route path="/lift/:liftId/inspection/sign-off" element={<SignOff />} />
        <Route path="/inspection/:inspectionId/report" element={<Report />} />
        <Route path="/inspection/:inspectionId/distribution" element={<Distribution />} />
        <Route path="/verify/:code" element={<Verify />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <DemoControls />
    </>
  )
}
