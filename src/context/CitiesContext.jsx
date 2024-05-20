import {createContext, useCallback, useContext, useEffect, useReducer, useState} from "react";

const BASE_URL = "http://localhost:8000";
const CitiesContext = createContext();

const initialState = {
    cities: [],
    isLoading: false,
    city: {},
    error: "",
}

function reducer(state, action) {
    switch (action.type) {
        case "loading":
            return {
                ...state,
                isLoading: true,
            }
        case "cities/loaded":
            return {
                ...state,
                isLoading: false,
                cities: action.payload,
            }
        case "city/loaded":
            return {
                ...state,
                isLoading: false,
                city: action.payload,
            }
        case "city/created":
            return {
                ...state,
                isLoading: false,
                cities: [...state.cities, action.payload],
                city: action.payload,
            }
        case "city/deleted":
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter((city) => city.id !== action.payload),
                city: {},
            }
        case "rejected":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        default:
            throw new Error("Unknown action type!");
    }
}

function CitiesProvider({children}) {
    const [{cities, isLoading, city, error}, dispatch] = useReducer(reducer, initialState);

        const getCity = useCallback(async function getCity(id) {
            if (Number(id) === city.id) return;

            dispatch({type: "loading"});
            try {
                const res = await fetch(`${BASE_URL}/cities/${id}`);
                const data = await res.json();
                dispatch({type: "city/loaded", payload: data});
            } catch (e) {
                dispatch({type: "rejected", payload: "There was an error getting a city."});
            }
        }, [city.id]);

    async function createCity(newCity) {
        dispatch({type: "loading"});
        try {
            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (res.ok) {
                dispatch({type: "city/created", payload: newCity});
            }

        } catch (e) {
            dispatch({type: "rejected", payload: "There was an error creating a city."});
        }
    }

    async function removeCity(id) {
        dispatch({type: "loading"});
        try {
            const res = await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE",
            });

            if (res.ok)
                dispatch({type: "city/deleted", payload: id});

        } catch (e) {
            dispatch({type: "rejected", payload: "There was an error removing a city."});
        }
    }

    useEffect(() => {
        async function fetchCities() {
            dispatch({type: "loading"});
            try {
                const res = await fetch(BASE_URL + "/cities");
                const data = await res.json();
                dispatch({type: "cities/loaded", payload: data});
            } catch (e) {
                dispatch({type: "rejected", payload: "There was an error fetching cities."});
            }
        }
        fetchCities();
    }, []);

    return (
        <CitiesContext.Provider value={{
            cities,
            isLoading,
            city,
            getCity,
            createCity,
            removeCity,
            error,
        }}>
            {children}
        </CitiesContext.Provider>
    );
}

function useCities() {
    return useContext(CitiesContext);
}

export {CitiesProvider, useCities};