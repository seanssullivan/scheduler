/**
 * Returns the apointment objects for a specified day.
 * @param {Object} state 
 * @param {String} day 
 */
export function getAppointmentsForDay(state, day) {
  const dayInfo = state.days.find((obj) => obj.name === day);

  return dayInfo ?
    dayInfo.appointments
    .map(id => state.appointments[id]) : [];
}