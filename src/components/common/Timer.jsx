import { useState, useEffect } from 'react';
import { settings } from '../../config/settings';

let timeIntervalId;

const Timer = props => {
  const { initialTime } = props;
  const [time, setTime] = useState(initialTime);
  console.log('initialTime', initialTime);

  useEffect(() => {
    if (initialTime >= settings.exprationTime.charachterInfoCaching) return;

    timeIntervalId = setInterval(() => {
      setTime(time - 1000);
    }, 1000);
    (() => {
      if (time <= 0) clearInterval(timeIntervalId);
    })();
  });

  return <div>{time}</div>;
};

export default Timer;
