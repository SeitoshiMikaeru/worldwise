import styles from "./CityItem.module.css";
import {Link} from "react-router-dom";
import {useCities} from "../context/CitiesContext";

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));

export default function CityItem({city}) {
    const {city: currentCity, removeCity} = useCities();
    const {cityName, emoji, date, id, position: {lat, lng}} = city;

    return (
      <li>
          <Link to={`${id}?lat=${lat}&lng=${lng}`} className={`${styles.cityItem} ${currentCity.id === id ? styles["cityItem--active"] : ""}`}>
              <span className={styles.emoji}>{emoji}</span>
              <h3 className={styles.name}>{cityName}</h3>
              <time className={styles.date}>{formatDate(date)}</time>
              <button
                  className={styles.deleteBtn}
                  onClick={
                      (e) => {
                          e.preventDefault();
                          removeCity(id);
                      }
                  }
              >
                  &times;
              </button>
          </Link>
      </li>
    );
}