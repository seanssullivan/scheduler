import React from "react";
import classNames from "classnames";

import "components/DayListItem.scss";

export default function DayListItem(props) {

  const formatSpots = spots => {
    return `${spots ? spots : 'no'} spot${spots > 1 || spots === 0 ? 's' : ''} remaining`;
  }

  const { name, spots, selected, setDay } = props;
  const dayClass = classNames({
    "day-list__item": true,
    "day-list__item--selected": selected,
    "day-list__item--full": spots === 0
 });
  return (
    <li
      className={ dayClass }
      onClick={ () => setDay(name) }
      data-testid="day"
    >
      <h2 className="text--regular">{ name }</h2> 
      <h3 className="text--light">{ formatSpots(spots) }</h3>
    </li>
  );
}
