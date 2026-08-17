import './style.css'

import Home from './Pages/home/Home.jsx'
import Time from './Pages/time/Time.jsx'
import Album from './Pages/album/Album.jsx'
import Carta from './Pages/carta/Carta.jsx'



function App() {



  return (
    <div className="container">
      <section className="section">
        <Home/>
      </section>

      <section className="section">
        <Time/>
      </section>

      <section className="section">
        <Album/>
      </section>

      <section className="section">
        <Carta/>
      </section>

    </div>
  )
}

export default App