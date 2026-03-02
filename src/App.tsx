import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/Layout/AppLayout'
import HomePage from './pages/HomePage'
import { pages } from './lib/pageRegistry'

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {pages.map((page) => {
            const Component = page.component
            if (!Component || page.external) return null
            return (
              <Route
                key={page.id}
                path={page.path}
                element={<Component />}
              />
            )
          })}
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
