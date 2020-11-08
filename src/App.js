import Header from './components/Header';
import Planner from './components/Planner';
import './App.css';

const App = () => (
  <div className="App">
    <Header />
    <div className="main">
      <Planner />
    </div>
  </div>
);

export default App;
