import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc)
dayjs.extend(timezone)
export const tzDayjs = (time: string | number | void) => time ? dayjs(time) : dayjs()