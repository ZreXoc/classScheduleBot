const times = "7:20,8:00,8:50,9:40,10:30,11:20,14:20,15:10,16:00,16:50,19:00,19:50,20:40".split(',')
const classes = [[
  {
    time: "0 15 7 * * 5",
    message:
      "今日课表: 英语 英语 生物 物理 物理 化学 数学 数学 语文 语文 数学 英语 语文",
  },
  { time: "0 15 7 * * 5", message: "这节是英语, 还有五分钟上课" },
  { time: "0 55 7 * * 5", message: "这节是英语, 还有五分钟上课" },
  { time: "0 45 8 * * 5", message: "这节是生物, 还有五分钟上课" },
  { time: "0 35 9 * * 5", message: "这节是物理, 还有五分钟上课" },
  { time: "0 25 10 * * 5", message: "这节是物理, 还有五分钟上课" },
  { time: "0 15 11 * * 5", message: "这节是化学, 还有五分钟上课" },
  { time: "0 15 14 * * 5", message: "这节是数学, 还有五分钟上课" },
  { time: "0 5 15 * * 5", message: "这节是数学, 还有五分钟上课" },
  { time: "0 55 15 * * 5", message: "这节是语文, 还有五分钟上课" },
  { time: "0 45 16 * * 5", message: "这节是语文, 还有五分钟上课" },
  { time: "0 55 18 * * 5", message: "这节是数学, 还有五分钟上课" },
  { time: "0 45 19 * * 5", message: "这节是英语, 还有五分钟上课" },
  { time: "0 35 20 * * 5", message: "这节是语文, 还有五分钟上课" },
]];
const date = new Date()
const idx = times
.reverse()
.findIndex((v) => v < `${date.getHours()}:${date.getDate()}`);
console.log(
  `这节课是${classes[date.getDay() - 1][idx].message}`
);
