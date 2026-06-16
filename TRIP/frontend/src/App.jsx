import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-background text-text">
      <Routes>
        <Route path="/" element={<div className="p-8 text-2xl font-bold">Trip Planner v2</div>} />
        {/* We will add more routes here */}
      </Routes>
    </div>
  )
}

export default App
