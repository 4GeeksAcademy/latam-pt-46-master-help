// src/components/HomeSections.jsx
import "../styles/home.css";
import heroImage from "../assets/img/hero2.webp";


const HomeSections = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section
  id="hero"
  className="hero-section text-center d-flex align-items-center"
  style={{
    backgroundImage: `url(${heroImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    zIndex: 1
  }}
>
  <div className="overlay"></div> {/* Capa oscura encima de la imagen */}
  <div className="container position-relative text-white z-2">
    <h1 className="mb-4">
      <span className="highlight">Transforma</span> el Caos en Orden: La Clave para{" "}
      <span className="highlight">Dominar</span> tus Procesos.
    </h1>
    <p className="lead mb-5 text-white">
      Olvida las hojas de cálculo confusas y las tareas perdidas. Con Master Help, diseña, automatiza y sigue tus flujos de trabajo de forma simple, visual y colaborativa. Recupera el control y potencia tu productividad.
    </p>
    <a href="#" className="btn btn-primary btn-lg px-5 py-3 me-sm-3 mb-3">
      🚀 Comienza tu Prueba Gratuita
    </a>
    <a href="#" className="btn btn-outline-light btn-lg px-5 py-3 mb-3">
      Ver Demo <i className="bi bi-play-circle ms-2"></i>
    </a>
  </div>
</section>


      {/* PROBLEM SECTION */}
      <section id="problem" className="section-padding">
        <div className="container">
          <h2 className="text-center mb-5">¿Tu Día a Día se Siente Así? Necesitas un Cambio.</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="card p-3 text-center">
                <div className="card-body">
                  <i className="bi bi-shuffle icon mb-3"></i>
                  <h3 className="card-title">Procesos "Sorpresa"</h3>
                  <p className="card-text">Inconsistencias y errores porque cada uno hace las cosas a su manera.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card p-3 text-center">
                <div className="card-body">
                  <i className="bi bi-files-alt icon mb-3"></i>
                  <h3 className="card-title">Información Dispersa</h3>
                  <p className="card-text">Documentos y aprobaciones perdidos entre correos y carpetas.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card p-3 text-center">
                <div className="card-body">
                  <i className="bi bi-person-video3 icon mb-3"></i>
                  <h3 className="card-title">Onboarding Interminable</h3>
                  <p className="card-text">Nuevos talentos tardan demasiado en aprender por falta de guías claras.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION BENEFITS */}
      <section id="solution-benefits" className="section-dark">
        <div className="container">
          <h2 className="text-center mb-5">Master Help: Donde el Flujo de Trabajo <span className="highlight">Funciona</span>.</h2>
          <div className="row text-center g-4">
            <div className="col-md-4">
              <i className="bi bi-bullseye icon mb-3"></i>
              <h5>Claridad Absoluta</h5>
              <p>Procesos estandarizados. Tu equipo sabe qué, cuándo y cómo hacerlo. Menos errores, más aciertos.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-people icon mb-3"></i>
              <h5>Colaboración Fluida</h5>
              <p>Todos en sintonía. Asigna, comparte y comunícate en un solo lugar. El trabajo en equipo, reinventado.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-rulers icon mb-3"></i>
              <h5>Adaptable a Ti</h5>
              <p>Personaliza campos, categorías y flujos. Master Help se moldea a tus necesidades únicas, no al revés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section-padding">
        <div className="container">
          <h2 className="text-center mb-5">En 3 Simples Pasos, <span className="highlight">Ordena</span> tu Mundo.</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="card text-center p-4">
                <div className="card-body">
                  <div className="display-3 mb-3" style={{ color: "#00BFFF" }}>1</div>
                  <h3 className="card-title h5">Diseña tu Flujo</h3>
                  <p className="card-text">Crea procesos con nuestro editor visual. Define pasos, responsables y campos a medida.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center p-4">
                <div className="card-body">
                  <div className="display-3 mb-3" style={{ color: "#00BFFF" }}>2</div>
                  <h3 className="card-title h5">Colabora con tu Equipo</h3>
                  <p className="card-text">Invita usuarios y asigna roles. Define quién crea, edita o visualiza. Control total.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center p-4">
                <div className="card-body">
                  <div className="display-3 mb-3" style={{ color: "#00BFFF" }}>3</div>
                  <h3 className="card-title h5">Ejecuta y Optimiza</h3>
                  <p className="card-text">Pon en marcha tus procesos. Monitorea, identifica mejoras y haz ajustes para la eficiencia.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section id="use-cases" className="section-dark">
        <div className="container">
          <h2 className="text-center mb-5">Perfecto para <span className="highlight">Todo</span> Tipo de Equipos e Industrias</h2>
          <div className="row text-center g-4">
            <div className="col-md-4">
              <i className="bi bi-person-check icon mb-3"></i>
              <h5>Recursos Humanos</h5>
              <p>Onboarding, vacaciones, evaluaciones. Centraliza y agiliza la gestión de talento.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-box-arrow-in-up-right icon mb-3"></i>
              <h5>Operaciones</h5>
              <p>Checklists, control de calidad, seguimiento de entregas. Optimiza tu cadena de valor.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-broadcast icon mb-3"></i>
              <h5>Marketing y Ventas</h5>
              <p>Campañas, aprobación de contenido, seguimiento de leads. No pierdas oportunidades.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="section-padding">
        <div className="container">
          <h2 className="text-center mb-5">Voces que <span className="highlight">Inspiran</span>: Lo que Dicen Nuestros Clientes</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card p-4">
                <div className="card-body text-center">
                  <img src="https://avatar.iran.liara.run/public/72 " alt="Nataly Castañeda" className="rounded-circle mb-3 avatar" />
                  <p className="fst-italic">"Master Help transformó nuestra coordinación interna. Redujimos errores y la comunicación es mucho más fluida. ¡Imprescindible!"</p>
                  <p className="fw-bold mt-3 mb-0">Nataly Castañeda</p>
                  <small className="text-muted">Profesora 4 Geeks</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4">
                <div className="card-body text-center">
                  <img src="https://avatar.iran.liara.run/public/37 " alt="Bryan" className="rounded-circle mb-3 avatar" />
                  <p className="fst-italic">"Rápido de implementar y súper adaptable a 4 Geeks. Personalizar los flujos a nuestra medida fue clave. ¡Totalmente recomendado!"</p>
                  <p className="fw-bold mt-3 mb-0">Bryan García</p>
                  <small className="text-muted">Profesor 4 Geeks</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4">
                <div className="card-body text-center">
                  <img src="https://avatar.iran.liara.run/public/4" alt="José Velázquez" className="rounded-circle mb-3 avatar" />
                  <p className="fst-italic">"El onboarding de empleados ahora es ágil y eficiente. Master Help nos dio la estructura que necesitábamos. ¡Nuestros nuevos talentos lo agradecen!"</p>
                  <p className="fw-bold mt-3 mb-0">José Velázquez</p>
                  <small className="text-muted">Profesor 4 Geeks</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="final-cta" className="final-cta-section text-center">
        <div className="container">
          <h2 className="mb-4">¿Listo para la <span style={{ color: "#FFFFFF" }}>Revolución</span> de la Eficiencia?</h2>
          <p className="lead mb-5" style={{ color: "#121212" }}>
            Deja de apagar fuegos y empieza a construir sistemas sólidos. Master Help te da el poder de trabajar de forma más inteligente.
          </p>
          <a href="#" className="btn btn-light btn-lg px-5 py-3">
            🚀 Sí, Quiero mi Prueba Gratuita
          </a>
          <p className="mt-3"><small>Sin tarjeta de crédito. Cancela cuando quieras.</small></p>
        </div>
      </section>
    </>
  );
};

export default HomeSections;