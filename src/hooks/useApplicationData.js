import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_REMAINING_SPOTS = "SET_REMAINING_SPOTS";

function reducer(state, action) {
  if (action.type === SET_DAY) {
    const { day } = action;
    return { ...state, day };
  }

  if (action.type === SET_APPLICATION_DATA) {
    const { days, appointments, interviewers } = action;
    return { ...state, days, appointments, interviewers };
  }

  if (action.type === SET_INTERVIEW) {
    const { id, interview } = action;
    const appointment = { ...state.appointments[id], interview };
    return {
      ...state,
      appointments: { ...state.appointments, [id]: appointment },
      interviewers: { ...state.interviewers }
    };
  }

  if (action.type === SET_REMAINING_SPOTS) {
    return { ...state, days: state.days.map(day => {
      return { ...day, spots: day.spots + action.value }
    })};
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
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    ws.onopen = (event) => {
      ws.send("ping");
    }
    ws.onmessage = (event) => {
      // console.log(`Message Received: ${event.data}`);
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
    return axios({
      method: "put",
      url: `/api/appointments/${id}`,
      data: { ...state.appointments[id], interview: { ...interview } }
    }).then((response) => {
      dispatch({ type: SET_INTERVIEW, id, interview });
      dispatch({ type: SET_REMAINING_SPOTS, value: -1 });
      return response;
    });
  }

  function cancelInterview(id) {
    return axios({
      method: "delete",
      url: `/api/appointments/${id}`,
      data: { ...state.appointments[id], interview: null }
    }).then((response) => {
      dispatch({ type: SET_INTERVIEW, id, interview: null });
      dispatch({ type: SET_REMAINING_SPOTS, value: 1 });
      return response;
    });
  }

  return { state, setDay, bookInterview, cancelInterview }
}