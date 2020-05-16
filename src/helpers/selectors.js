/**
 * Returns the appointment objects for a specified day.
 * @param {Object} state 
 * @param {String} day 
 */
export function getAppointmentsForDay(state, day) {
  const dayInfo = state.days.find((obj) => obj.name === day);

  return dayInfo ?
    dayInfo.appointments
    .map(id => state.appointments[id]) : [];
}

/**
 * Returns the interviewers objects for a specified day.
 * @param {Object} state 
 * @param {String} day 
 */
export function getInterviewersForDay(state, day) {
  const dayInfo = state.days.find((obj) => obj.name === day);

  return dayInfo ?
    dayInfo.interviewers
    .map(id => state.interviewers[id]) : [];
}

/**
 * Return an interview object containing the interviewer's information.
 * @param {Object} state 
 * @param {Object} interview 
 */
export function getInterview(state, interview) {
  if (!interview) return null;
  
  const interviewerId = interview.interviewer;
  const interviewer = state.interviewers[interviewerId];
  return {
    ...interview,
    interviewer: interviewer
  };
}
