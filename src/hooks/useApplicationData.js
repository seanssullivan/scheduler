import { useState, useEffect } from "react";
import axios from "axios";

export function useApplicationData() {
  const [ state, setState ] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }))
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
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios({
      method: "put",
      url: `/api/appointments/${id}`,
      data: appointment
    }).then((response) => {
        setState(prev => ({
          ...prev,
          days,
          appointments
        }));
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
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios({
      method: "delete",
      url: `/api/appointments/${id}`,
      data: appointment
    }).then((response) => {
        setState(prev => ({
          ...prev,
          days,
          appointments
        }));
        return response;
      });
  }

  return { state, setDay, bookInterview, cancelInterview }
}