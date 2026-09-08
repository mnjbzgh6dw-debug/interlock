/**
 * Where each persona starts. The inspector lands on the register, per brief
 * section 10.1. The technician and the owner land on their worklist, because
 * neither of them starts inspections and a register of lifts they cannot act on
 * is the wrong first screen.
 */

import Register from './Register'
import Worklist from './Worklist'
import { useStore } from '../state/useStore'

export default function Landing() {
  const { state } = useStore()
  return state.persona === 'inspector' ? <Register /> : <Worklist />
}
