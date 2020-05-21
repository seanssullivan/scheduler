import { useReducer, useEffect } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  SET_REMAINING_SPOTS
} from "reducers/application";

export function useApplicationData() {
  const [ state, dispatch ] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    ws.onopen = (event) => {
      ws.send("ping");
    }
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type) {
        dispatch(response);
      }
    }
  }, []);

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const [ days, appointments, interviewers ] = all.map(res => res.data);
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers });
    })
  }, []);

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { ...state.appointments[id], interview: { ...interview } })
      .then((response) => {
        dispatch({ type: SET_INTERVIEW, id, interview });
        dispatch({ type: SET_REMAINING_SPOTS, value: -1 });
        return response;
      });
  }

  function editInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { ...state.appointments[id], interview: { ...interview } })
      .then((response) => {
        dispatch({ type: SET_INTERVIEW, id, interview });
        return response;
      });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`, { ...state.appointments[id], interview: null })
      .then((response) => {
        dispatch({ type: SET_INTERVIEW, id, interview: null });
        dispatch({ type: SET_REMAINING_SPOTS, value: 1 });
        return response;
      });
  }

  return { state, setDay, bookInterview, editInterview, cancelInterview }
}