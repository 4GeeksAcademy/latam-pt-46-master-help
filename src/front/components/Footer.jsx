const Footer = () => {
	return (
		<footer className="footer mt-5">
			<div className="container text-center">
				<p>&copy; {new Date().getFullYear()} Master Help</p>
				<div>
					<a href="#" className="me-3"><i className="bi bi-linkedin"></i></a>
					<a href="#" className="me-3"><i className="bi bi-twitter-x"></i></a>
					<a href="#"><i className="bi bi-facebook"></i></a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
