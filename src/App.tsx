import { Routes, Route } from 'react-router-dom'
import Review from './pages/Review'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Review />} />
    </Routes>
  )
}

export default App
