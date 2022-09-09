import { parse } from "csv-parse/sync";

export const parseTime = (time) => {
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(h);
  d.setMinutes(m);
  return d;
};
/**
 *
 * @param {Date} date
 */
export const toTime = (date) =>
  `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

/**
 *
 * @param {string} className
 * @param {{time:string}} param1
 * @returns
 */
export const nextClass = (className) => `下节是${className}，还有2分钟`;

/**
 *
 * @param {string} className
 * @param {{time:string}} param1
 * @returns
 */
export const classOver = (className) => `${className}已经下课了!`;
/**
 *
 * @param {number} dayOfWeek
 * @param {string[]} times
 * @param {string[]} classes
 * @returns
 */
export const day = (dayOfWeek, times, classes) => {
  const MIN_PER_CLASS = +process.env.MIN_PER_CLASS || 40;

  const schedule = [
    {
      time: `0 15 7 * * ${dayOfWeek}`,
      message: `今日课表: ${classes.join(" ")}`,
    },
  ];
  times.forEach((time, idx) => {
    const d = parseTime(time),
      twoMinBeforeCurrentClass = new Date(),
      timeOfClassOver = new Date();

    twoMinBeforeCurrentClass.setTime(d.getTime() - 2 * 60 * 1000);
    timeOfClassOver.setTime(d.getTime() + MIN_PER_CLASS * 60 * 1000);

    schedule.push({
      time: `0 ${twoMinBeforeCurrentClass.getMinutes()} ${twoMinBeforeCurrentClass.getHours()} * * ${dayOfWeek}`,
      message: nextClass(classes[idx]),
    });

    schedule.push({
      time: `0 ${timeOfClassOver.getMinutes()} ${timeOfClassOver.getHours()} * * ${dayOfWeek}`,
      message: classOver(classes[idx]),
    });
  });
  return schedule;
};

/**
 *
 * @param {string[]} times
 * @param {string[][]} classes
 * @returns
 */
export const week = (times, classes) =>
  classes.map((classes, idx) => day(idx + 1, times, classes));

/**
 *
 * @param {string | Buffer} data
 * @return {{data:{times:string[],classes:string[][]}}}
 */
export const fromCSV = (data) => {
  const [times, ...classes] = parse(data, { autoParse: true });
  // console.log(times, classes);
  return {
    data: {
      times,
      classes,
    },
    schedule: week(times, classes).flat(),
  };
};
