const TripCard = ({
  id,
  imageUrl,
  location,
  name,
  price,
  tags,
}: TripCardProps) => {
  return (
    <div className="trip-card">
      <img src={imageUrl} alt={name} />
      <h3>{name}</h3>
      <p>{location}</p>
      <p>{price}</p>
      <div className="tags">
        {tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TripCard;
