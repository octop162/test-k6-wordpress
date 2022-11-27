import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export default function () {
  const url = "http://localhost:8000?rest_route=/wp/v2/posts";
  const payload = JSON.stringify({
    title: "title",
    contents: "1234567890".repeat(50 * 1000), //500KB
  });
  const params = {
    headers: {
      Authorization: "Basic cm9vdDp0YWl5b3U=",
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params, { tags: { name: "base" } });

  check(res, {
    "status was 201": (r) => {
      return r.status == 201;
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
    "summary2.html": htmlReport(data),
    "summary2.json": JSON.stringify(data),
  };
}
