import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export default function () {
  const url = "http://localhost:8000";

  const res = http.get(url, { tags: { name: "base" } });

  check(res, {
    "status was 200": (r) => {
      return r.status == 200;
    },
  });
}

export const options = {
  duration: "30s",
  vus: 200,
  rps: 200,
  thresholds: {
    http_req_duration: ["avg<1000"],
  },
};

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    "summary.html": htmlReport(data),
    "summary.json": JSON.stringify(data),
  };
}
