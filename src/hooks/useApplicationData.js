import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW"

function reducer(state, action) {
  if (action.type === SET_DAY) {
    return {
      ...state,
      day: action.day
    };
  }
  if (action.type === SET_APPLICATION_DATA) {
    return {
      ...state,
      days: action.days,
      appointments: action.appointments,
      interviewers: action.interviewers
    };
  }
  if (action.type === SET_INTERVIEW) {
    const appointment = {
      ...state.appointments[action.id],
      interview: action.interview || null
    };
    const appointments = {
      ...state.appointments,
      [action.id]: appointment
    };
    return {
      ...state,
      appointments
    };
  }
}

export function useApplicationData() {
  const [ state, dispatch ] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      })
    })
  }, []);

  // state.days.find((day) => day.name === state.day)

  function bookInterview(id, interview) {
    const days = [ ...state.days];
    const currentDay = days.find((day) => day.name === state.day);
    currentDay.spots--;

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    return axios({
      method: "put",
      url: `/api/appointments/${id}`,
      data: appointment
    }).then((response) => {
        dispatch({ type: SET_INTERVIEW, interview });
        return response;
      });
  }

  function cancelInterview(id) {
    const days = [ ...state.days];
    const currentDay = days.find((day) => day.name === state.day);
    currentDay.spots++;

    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    
    return axios({
      method: "delete",
      url: `/api/appointments/${id}`,
      data: appointment
    }).then((response) => {
        dispatch({ type: SET_INTERVIEW, interview: null });
        return response;
      });
  }

  return { state, setDay, bookInterview, cancelInterview }
}