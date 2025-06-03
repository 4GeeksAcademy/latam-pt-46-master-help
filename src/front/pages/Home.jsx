import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeSections from "../components/HomeSections";
// En App.jsx o en tu componente raíz
import '../styles/home.css'; // Importa el CSS de home.css


const Home = () => {
  return (
    <>
      <Navbar />
      <HomeSections />
    </>
  );
};

export default Home;
