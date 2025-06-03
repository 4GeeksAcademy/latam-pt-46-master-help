import React from 'react';
import '../styles/home.css'; // Asegúrate de que esta ruta sea correcta para tu CSS general

const AboutUsSection = () => {
  return (
    <>
      <section id="about-us" className="section-padding">
        <div className="container">
          <h2 className="text-center mb-4">Nuestro Equipo: Impulsando Master Help</h2>
          <p className="lead text-center mb-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Somos el cerebro y el corazón detrás de Master Help, un equipo apasionado por simplificar procesos y potenciar la productividad. Conoce a las mentes que hacen esto posible.
          </p>

          <div className="row g-4 justify-content-center">
            {/* Juan Pablo Aquino */}
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 team-member-card">
                <div className="card-body text-center d-flex flex-column align-items-center">
                  <div className="position-relative mb-3">
                    <img
                      src="src/front/assets/jp.jpg" // Reemplaza con la URL de la foto real de Juan Pablo
                      alt="Juan Pablo Aquino"
                      className="rounded-circle mb-3 avatar-team"
                    />
                    {/* Asegúrate de que la librería flag-icon-css esté importada en tu CSS o index.html */}
                    <span className="flag-icon flag-icon-mx position-absolute bottom-0 end-0 me-2 mb-2"></span> {/* Bandera de México */}
                  </div>
                  <h3 className="card-title mb-1">Juan Pablo Aquino</h3>
                  <p className="text-muted small mb-3">Co-fundador & Estratega Digital</p>
                  <div className="text-start w-100 flex-grow-1">
                    <p><strong>Estudios:</strong> Ingeniería en Sistemas Computacionales, Especialización en Marketing Digital.</p>
                    <p><strong>Hobbies:</strong> Senderismo, fotografía, aprender nuevos idiomas.</p>
                    <p><strong>Experiencia Profesional:</strong> Más de 15 años en desarrollo de software escalable y estrategias de lanzamiento de productos tecnológicos. </p>
                    <p className="fst-italic text-secondary mt-2">"Mi pasión es traducir ideas complejas en soluciones sencillas."</p>
                  </div>
                  <a href="https://www.linkedin.com/in/juanpabloaquino" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light mt-3 btn-sm">Conectar</a>
                </div>
              </div>
            </div>

            {/* Javier Varela */}
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 team-member-card">
                <div className="card-body text-center d-flex flex-column align-items-center">
                  <div className="position-relative mb-3">
                    <img
                      src="https://picsum.photos/id/65/120/120" // Reemplaza con la URL de la foto real de Javier Varela
                      alt="Javier Varela"
                      className="rounded-circle mb-3 avatar-team"
                    />
                    <span className="flag-icon flag-icon-ve position-absolute bottom-0 end-0 me-2 mb-2"></span> {/* Bandera de Venezuela */}
                  </div>
                  <h3 className="card-title mb-1">Javier Varela</h3>
                  <p className="text-muted small mb-3">Co-fundador & Arquitecto de Software</p>
                  <div className="text-start w-100 flex-grow-1">
                    <p><strong>Estudios:</strong> Ciencias de la Computación, Maestría en Arquitectura de Software.</p>
                    <p><strong>Hobbies:</strong> Programación de videojuegos, ajedrez, lectura de ciencia ficción.</p>
                    <p><strong>Experiencia Profesional:</strong> Más de 18 años diseñando y construyendo arquitecturas robustas para plataformas empresariales.</p>
                    <p className="fst-italic text-secondary mt-2">"Construyendo el futuro, un algoritmo a la vez."</p>
                  </div>
                  <a href="https://www.linkedin.com/in/javiervarela" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light mt-3 btn-sm">Conectar</a>
                </div>
              </div>
            </div>

            {/* Sergio Orjuela */}
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 team-member-card">
                <div className="card-body text-center d-flex flex-column align-items-center">
                  <div className="position-relative mb-3">
                    <img
                      src="https://picsum.photos/id/66/120/120" // Reemplaza con la URL de la foto real de Sergio Orjuela
                      alt="Sergio Orjuela"
                      className="rounded-circle mb-3 avatar-team"
                    />
                    <span className="flag-icon flag-icon-co position-absolute bottom-0 end-0 me-2 mb-2"></span> {/* Bandera de Colombia */}
                  </div>
                  <h3 className="card-title mb-1">Sergio Orjuela</h3>
                  <p className="text-muted small mb-3">Co-fundador & Experto en UX/UI</p>
                  <div className="text-start w-100 flex-grow-1">
                    <p><strong>Estudios:</strong> Diseño Gráfico y Experiencia de Usuario, Certificación en Psicología Cognitiva.</p>
                    <p><strong>Hobbies:</strong> Ilustración digital, ciclismo de montaña, cocinar.</p>
                    <p><strong>Experiencia Profesional:</strong> Más de 12 años liderando el diseño de interfaces intuitivas y experiencias de usuario memorables para SaaS.</p>
                    <p className="fst-italic text-secondary mt-2">"Haciendo la tecnología tan humana como sea posible."</p>
                  </div>
                  <a href="https://www.linkedin.com/in/sergioorjuela" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light mt-3 btn-sm">Conectar</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUsSection;