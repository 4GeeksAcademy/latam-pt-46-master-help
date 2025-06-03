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
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 team-member-card">
                <div className="card-body text-center d-flex flex-column align-items-center">
                  <div className="position-relative mb-3">
                    <img
                      src="src/front/assets/jp.jpg"
                      alt="Juan Pablo Aquino"
                      className="rounded-circle mb-3 avatar-team"
                    />
                    <span className="flag-icon flag-icon-mx position-absolute bottom-0 end-0 me-2 mb-2"></span>
                  </div>
                  <h3 className="card-title mb-1">Juan Pablo Aquino</h3>
                  <p className="text-muted small mb-3">Co-fundador & Estratega Digital</p>
                  <div className="text-start w-100 flex-grow-1">
                    <p><strong>Estudios:</strong> Licenciado en Ciencias de la Comunicación, Maestría en Marketing Digital y Comercio Electrónico.</p>
                    <p><strong>Hobbies:</strong> Diseño, fotografía, aprender algo nuevo diario y ahora... Programacion!</p>
                    <p><strong>Experiencia Profesional:</strong> Más de 20 años en estrategias de Marketing Digital, diseño web. Actualmente a cargo de la agencia de Marketing Digital <a href='https://amarilio.com.mx' target="_blank" rel="noopener noreferrer" className=" mt-3 btn-sm">Amarilio</a> en México, desarrollo de producto en <a href='https://seccionamarilla.com.mx' target="_blank" rel="noopener noreferrer" className=" mt-3 btn-sm">Sección Amarilla</a> y a cargo del equipo de consultoría para clientes en <a href='https://www.aceleradordigitaldenegocios.com.mx/' target="_blank" rel="noopener noreferrer" className=" mt-3 btn-sm">ADN</a> </p>
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
                      src="src/front/assets/img/javierVarela.jpg"
                      alt="Javier Varela"
                      className="rounded-circle mb-3 avatar-team"
                    />
                    <span className="flag-icon flag-icon-ve position-absolute bottom-0 end-0 me-2 mb-2"></span> {/* Bandera de Venezuela */}
                  </div>
                  <h3 className="card-title mb-1">Javier Varela</h3>
                  <p className="text-muted small mb-3">Co-fundador & Arquitecto de Software</p>
                  <div className="text-start w-100 flex-grow-1">
                    <p><strong>Estudios:</strong> Desarollo de Software Full-stack y Especialista en Redes.</p>
                    <p><strong>Hobbies:</strong> Programación también forma parte de mis pasatiempos, así como lo son los videojuegos, tecnologías open source, café, etc.</p>
                    <p><strong>Experiencia Profesional:</strong> Más de 4 años en el área de redes, diseñando y automatizando procesos de dispositivos. Logrando mejorar la eficiencia del personal técnico a través del desarrollo de scripts, webapps y APIs </p>
                    <p className="fst-italic text-secondary mt-2">"Construyendo el futuro, un algoritmo a la vez."</p>
                  </div>
                  <a href="https://www.linkedin.com/in/javier-varela-9a415b201/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light mt-3 btn-sm">Conectar</a>
                </div>
              </div>
            </div>

            {/* Sergio Orjuela */}
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 team-member-card">
                <div className="card-body text-center d-flex flex-column align-items-center">
                  <div className="position-relative mb-3">
                    <img
                      src="src/front/assets/img/IMG_8192.jpg"
                      alt="Sergio Orjuela"
                      className="rounded-circle mb-3 avatar-team"
                    />
                    <span className="flag-icon flag-icon-co position-absolute bottom-0 end-0 me-2 mb-2"></span>
                  </div>
                  <h3 className="card-title mb-1">Sergio Orjuela</h3>
                  <p className="text-muted small mb-3">Co-fundador & Experto en UX/UI</p>
                  <div className="text-start w-100 flex-grow-1">
                    <p><strong>Estudios:</strong> Ingeniero Agroindustrial con formación complementaria en desarrollo web Full-stack.</p>
                    <p><strong>Hobbies:</strong> Me apasiona el montañismo, el futbol y experimentar con nuevas tecnologías en mis proyectos personales.</p>
                    <p><strong>Experiencia Profesional:</strong> Cuento con más de 6 años de experiencia en producción agrícola bajo invernadero. Actualmente me especializo en desarrollo de software y gestión de procesos digitales.</p>
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