import TiltedCard from "./TiltedCard";

function DirectorBanner({ index, label, name, description, experience, image, reverse }) {
  const className = `director-banner${reverse ? ' director-banner--reverse' : ''}`

  return (
    <article className={className}>
      <div className="director-banner__media">
       <TiltedCard
        imageSrc={image}
        altText={name}
        captionText={experience}
        containerHeight="100%"
        containerWidth="100%"
        imageHeight="100%"
        imageWidth="100%"
        showMobileWarning={false}
        showTooltip={true}
      />
      </div>
      <div className="director-banner__content">
        <span className="director-banner__index">{index}</span>
        <p className="director-banner__label">{label}</p>
        <h2>{name}</h2>
        <p className="director-banner__description">{description}</p>
      </div>
    </article>
  )
}

export default DirectorBanner
