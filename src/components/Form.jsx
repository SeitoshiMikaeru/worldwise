// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import "react-datepicker/dist/react-datepicker.css";

import {useEffect, useState} from "react";

import DatePicker from "react-datepicker";
import {useNavigate} from "react-router-dom";

import styles from "./Form.module.css";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import {useURLPosition} from "../hooks/useURLPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import {useCities} from "../context/CitiesContext";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
    const {createCity, isLoading} = useCities();
    const navigate = useNavigate();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
    const [startDate, setStartDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [emoji, setEmoji] = useState("");

  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [geoError, setGeoError] = useState("");

    const {lat, lng} = useURLPosition();

    useEffect(() => {

        if(!lat && !lng)
            return;

        async function fetchCityData() {
            try {
                setIsLoadingGeo(true);
                setGeoError("");
                const res = await fetch (`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
                const data = await res.json();

                if(!data.countryCode)
                    throw new Error("That does not seem to be a city. Click somewhere else ;)");

                setCityName(data.city || data.locality || "");
                setCountry(data.countryName || "");
                setEmoji(convertToEmoji(data.countryCode));
            } catch (e) {
                setGeoError(e.message);
            } finally {
                setIsLoadingGeo(false);
            }
        }

        fetchCityData();
    }, [lat, lng]);

    if(isLoadingGeo)
        return <Spinner />

    if(geoError)
        return <Message message={geoError} />

    if(!lat && !lng)
        return <Message message="Start by clicking somewhere on the map!" />

    async function handleSubmit(e) {
        e.preventDefault();

        if(!cityName || !startDate)
            return;

        const newCity = {
            cityName,
            country,
            notes,
            emoji,
            date: startDate,
            position: {lat, lng},
            id: JSON.stringify(Date.now()),
        }

        await createCity(newCity);
        navigate("/app/cities");
    }

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} id="date"/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;

// <input
//     id="date"
//     onChange={(e) => setDate(e.target.value)}
//     value={date}
// />