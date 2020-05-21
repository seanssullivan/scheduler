export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";
export const SET_REMAINING_SPOTS = "SET_REMAINING_SPOTS";

export default function reducer(state, action) {
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
      return day.name === state.day ? 
        { ...day, spots: day.spots + action.value } :
        { ...day, spots: day.spots };
    })};
  }

  throw new Error(
    `Tried to reduce with unsupported action type: ${action.type}`
  );
}
