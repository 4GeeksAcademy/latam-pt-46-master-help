import logo from "../assets/img/master-help-logo-hz.webp";

const Footer = () => {
    return (
        <footer className="footer mt-5">
            <div className="container text-center">
                <div className="d-flex justify-content-center align-items-center mb-2">
                    <img
                        src={logo}
                        alt="Master Help Logo"
                        className="img-fluid"
                        style={{ maxWidth: "400px", width: "100%", height: "auto" }}
                    />
					<p className="mb-0 me-2">&copy; 2025</p>

                </div>
            </div>
        </footer>
    );
};

export default Footer;