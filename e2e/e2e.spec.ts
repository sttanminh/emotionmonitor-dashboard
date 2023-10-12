import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // Listen for all console logs
  page.on("console", (msg) => console.log(msg.text()));
});

test.describe("Dashboard loads as expected", () => {
  test("has title", async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Emotimonitor Dashboard/);
  });

  test("project dropdown visible and interactive", async ({ page }) => {
    const projectSelector = page.getByTestId("projectSelector");
    // the default project should be selected and visible
    await expect(projectSelector).toBeVisible();

    await projectSelector.click();

    // when the project is selected the search box should be found
    await expect(page.getByPlaceholder("Type to search...")).toBeVisible();
  });

  test("view by task button reveals task selector", async ({ page }) => {
    // set up locators
    const byTaskButton = page.getByTestId("byTaskButton");
    const taskSelector = () => page.getByTestId("taskSelector");

    // initial state should show task button visible and enabled and no task selector
    await expect(byTaskButton).toBeVisible();
    await expect(await taskSelector()).not.toBeVisible();

    // click the button
    await byTaskButton.click();

    // task selector should now be visible
    await expect(taskSelector()).toBeVisible();
  });

  test("graphs load when there is data", async ({ page }) => {
    await expect(page.getByText("Metric Summary")).toBeVisible();
    await expect(page.getByText("Emotion Summary")).toBeVisible();
  });
});

test.describe("Dashboard is configured as expected", () => {
  test("new level is added to a metric and is reflected in the metric graph", async ({
    page,
  }) => {
    // ensure metric graph is visible
    await expect(page.getByText("Metric Summary")).toBeVisible();

    //navigate to config page
    await page.getByTestId("configButton").click();
    const targetMetric = "Complexity";
    // Adding a level should add a level to the page
    const metricEditButton = await page.getByTestId(
      `edit-metric-${targetMetric}`
    );
    await metricEditButton.click();
    const addLevelButton = await page.getByTestId(`add-level-${targetMetric}`);
    await addLevelButton.click();
    const levelInput = await page.getByPlaceholder("New Level", {
      exact: true,
    });
    await expect(levelInput).toBeVisible();
    const testText = "Test Level";
    await levelInput.fill(testText);
    await (await page.getByTestId(`save-button-${targetMetric}`)).click();

    // go back to graph page
    await (await page.getByTestId("back-button")).click();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // new level should be visible
    await expect(await page.getByText(testText)).toBeVisible();

    // clean up
    // navigate back to config page
    await (await page.getByTestId("configButton")).click();

    await (await page.getByTestId(`edit-metric-${targetMetric}`)).click();
    const deleteLevelButton = await page.getByTestId(
      `delete-level-${testText}`
    );
    await expect(deleteLevelButton).toBeVisible();
    await deleteLevelButton.click();
    await (await page.getByTestId(`save-button-${targetMetric}`)).click();
  });

  test("a metric is added to the project and is shown on the metric graph as it is active", async ({
    page,
  }) => {
    // ensure metric graph is visible
    await expect(page.getByText("Metric Summary")).toBeVisible();

    //navigate to config page
    await (await page.getByTestId("configButton")).click();

    const addMetricButton = await page.getByTestId("add-metric-button");

    await expect(addMetricButton).toBeVisible();

    await addMetricButton.click();

    const newMetricConfig = await page.getByText("New Metric");

    await expect(newMetricConfig).toBeVisible();

    // Change name of new metric
    const metricEditButtons = await page.getByTestId("edit-metric-New Metric");
    await metricEditButtons.click();

    const metricNameInput = await page.getByPlaceholder("New Metric", {
      exact: true,
    });
    await expect(metricNameInput).toBeVisible();
    const testText = "TestMetric";
    await metricNameInput.fill(testText);
    // test id is set to the value of the currently set name
    await (await page.getByTestId(`save-button-${testText}`)).click();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // go back to graph page
    await (await page.getByTestId("back-button")).click();

    await expect(page.url()).toBe("http://localhost:3000/");

    // ensure metric graph is visible
    await expect(await page.getByText("Metric Summary")).toBeVisible();

    // new metric should be visible
    await expect(await page.getByText(testText)).toBeVisible();

    // clean up
    await (await page.getByTestId("configButton")).click();

    const deleteMetricButton = await page.getByTestId(`delete-${testText}`);
    await expect(deleteMetricButton).toBeVisible();
    await deleteMetricButton.click();
  });

  test("removing a metric (that has ratings in the last week) should not remove it from the metric graph", async ({
    page,
  }) => {
    // ensure metric graph is visible
    await expect(page.getByText("Metric Summary")).toBeVisible();

    //navigate to config page
    await (await page.getByTestId("configButton")).click();

    const targetMetric = "Workload";

    // delete difficulty button (not touched by other tests)
    const metricDeleteButton = await page.getByTestId(`delete-${targetMetric}`);

    await expect(metricDeleteButton).toBeVisible();

    await metricDeleteButton.click();

    await expect(metricDeleteButton).not.toBeVisible();

    // go back to graph page
    await (await page.getByTestId("back-button")).click();

    // metric should still be visible
    await expect(await page.getByText(targetMetric)).toBeVisible();

    // clean up
    await (await page.getByTestId("configButton")).click();

    const addMetricButton = await page.getByTestId("add-metric-button");

    await expect(addMetricButton).toBeVisible();

    await addMetricButton.click();
    // Change name of new metric
    const metricEditButton = await page.getByTestId(`edit-metric-New Metric`);
    await metricEditButton.click();

    const metricNameInput = await page.getByPlaceholder("New Metric", {
      exact: true,
    });
    await expect(metricNameInput).toBeVisible();

    await metricNameInput.fill(targetMetric);
    // name of test id on save button changes when metric name is filled
    await (await page.getByTestId(`save-button-${targetMetric}`)).click();
  });

  test("renaming a level (that has ratings in the last week) should create a new level for that metric on the graph", async ({
    page,
  }) => {
    // ensure metric graph is visible
    await expect(await page.getByText("Metric Summary")).toBeVisible();

    //navigate to config page
    await (await page.getByTestId("configButton")).click();

    // edit workload metric
    const metricEditButton = await page.getByTestId("edit-metric-Complexity");

    await expect(metricEditButton).toBeVisible();

    await metricEditButton.click();

    const existingText = "epic";
    const inputField = await page.getByPlaceholder(existingText);
    const testText = "super";
    await inputField.fill(testText);
    await (await page.getByTestId("save-button-Complexity")).click();

    // go back to graph page
    await (await page.getByTestId("back-button")).click();

    // new level should be visible
    await expect(await page.getByText(testText)).toBeVisible();
    // old level should also be visible
    await expect(await page.getByText(existingText)).toBeVisible();

    // clean up
    //navigate to config page
    await (await page.getByTestId("configButton")).click();

    // edit workload metric
    const revertMetricEditButton = await page.getByTestId(
      "edit-metric-Complexity"
    );

    await expect(revertMetricEditButton).toBeVisible();

    await revertMetricEditButton.click();

    const revertInputField = await page.getByPlaceholder(testText);
    await revertInputField.fill(existingText);
    await (await page.getByTestId("save-button-Complexity")).click();
  });

  test("emoji change is reflected in the graphs", async ({ page }) => {
    // todo: when emoji config has been added need to have an e2e test ensuring the emojis used in the graphs are the current emoji
    // as emojis are just visual representations of the emotional rating, these can change instantaneously and aren't soft deleted
    expect(true);
  });
});
