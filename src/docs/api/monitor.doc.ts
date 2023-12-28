export const monitorBody = {
  project: "0", // TODO: create project schema
  url: "http://www.example.com",
  users: [{ name: "John Doe", email: "user@example.com" }],
  statusCode: 200,
  active: true,
  title: "Example",
};

export const monitorResponse = {
  projectId: "0",
  url: "http://www.example.com",
  users: [],
  statusCode: 200,
  active: true,
  title: "Example",
  online: true,
  _id: "5f9b0b0b9b9b9b9b9b9b9b9b",
  __v: 0,
};

export const monitorResponseDetailed = {
  id: "657e38cd7e817f716788e286",
  project: "Example Project",
  company: "IkeHunter Web Development",
  url: "https://ikehunter.com/test/",
  recipients: [],
  status: "",
  targetStatusCode: 200,
  currentStatusCode: 200,
  active: true,
  title: "IkeHunter live 2",
  type: "http",
  dateAdded: "2023-12-16T23:54:53.025Z",
  responseTime: -1,
  timeout: 30,
  retries: 3,
  coverImage: "",
  events: [
    {
      _id: "657e49eab564770f86aca7b6",
      monitorId: "657e38cd7e817f716788e286",
      statusCode: 200,
      online: true,
      timestamp: "2023-12-17T01:07:54.312Z",
      message: "Example log message.",
      responseTime: 200,
      __v: 0,
    },
    {
      _id: "657e4bb98a890b85d551182c",
      monitorId: "657e38cd7e817f716788e286",
      statusCode: 200,
      online: true,
      timestamp: "2023-12-17T01:15:37.188Z",
      message: "Example log message.",
      responseTime: 200,
      __v: 0,
    },
  ],
  report: {
    startDate: "2023-12-17T01:07:54.312Z",
    endDate: "2023-12-17T01:15:37.188Z",
    totalDays: 2,
    totalUptimeMinutes: 7.7146,
    totalDowntimeMinutes: 0,
    daysWithDowntime: [],
    totalEvents: 2,
    totalUptimeEvents: 2,
    totalDowntimeEvents: 0,
    averageResponseTime: 200,
    _id: "657e4c01ebafc9f07bc1d93e",
    __v: 0,
  },
  responses: [
    {
      responseTime: 0,
      timestamp: "2023-12-17T01:16:49.845Z",
    },
  ],
};
