import { events } from '../../data/home'

function EventsSection() {
  return (
    <section className="home-events" aria-labelledby="home-events-title">
      <div className="home-events__header">
        <p className="home-events__kicker">Nossos eventos</p>
        <h2 id="home-events-title" className="home-events__title">
          A Lamit também é palco.
        </h2>
      </div>

      <div className="home-events__list">
        {events.map((event) => (
          <article
            key={event.id}
            className={`home-event${event.reverse ? ' home-event--reverse' : ''}`}
          >
            <div className="home-event__media">
              <picture>
                <source srcSet={`${event.photo.base}.webp`} type="image/webp" />
                <img
                  src={`${event.photo.base}.jpg`}
                  alt={event.photo.alt}
                  width={event.photo.width}
                  height={event.photo.height}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>

            <div className="home-event__content">
              <p className="home-event__date">{event.date}</p>
              <h3 className="home-event__title">{event.title}</h3>
              <p className="home-event__role">{event.role}</p>
              <p className="home-event__description">{event.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default EventsSection
