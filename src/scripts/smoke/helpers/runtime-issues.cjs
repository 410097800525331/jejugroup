const { expect } = require("@playwright/test");

const createIssueTracker = (page) => {
  const consoleErrors = [];
  const pageErrors = [];
  const requestFailures = [];
  const responseErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      if (message.text().includes("Failed to load resource")) {
        return;
      }
      consoleErrors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  page.on("requestfailed", (request) => {
    requestFailures.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText}`);
  });

  page.on("response", (response) => {
    const url = response.url();
    if (!url.startsWith("http://127.0.0.1:")) {
      return;
    }

    if (response.status() < 400 || url.endsWith("/favicon.ico")) {
      return;
    }

    responseErrors.push(`${response.status()} ${url}`);
  });

  return {
    consoleErrors,
    pageErrors,
    requestFailures,
    responseErrors,
  };
};

const expectNoRuntimeIssues = ({ consoleErrors, pageErrors, requestFailures, responseErrors }) => {
  expect(
    consoleErrors,
    `console error 발생 상태\n${consoleErrors.join("\n")}`,
  ).toEqual([]);
  expect(
    pageErrors,
    `pageerror 발생 상태\n${pageErrors.join("\n")}`,
  ).toEqual([]);
  expect(
    requestFailures,
    `requestfailed 발생 상태\n${requestFailures.join("\n")}`,
  ).toEqual([]);
  expect(
    responseErrors,
    `4xx/5xx 응답 발생 상태\n${responseErrors.join("\n")}`,
  ).toEqual([]);
};

module.exports = {
  createIssueTracker,
  expectNoRuntimeIssues,
};
