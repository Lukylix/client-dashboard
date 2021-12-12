import "./Card.scss";
const Card = ({ children, title }) => {
	return (
		<div className="Card">
			<h2>{title}</h2>
			<div className="Card__content">{children}</div>
		</div>
	);
};

export default Card;
