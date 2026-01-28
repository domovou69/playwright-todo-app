import { Locator, Page } from "@playwright/test";
import { FiltersComponent } from "./components/filters";

export class TodosPage {
  readonly page: Page;
  readonly filters: FiltersComponent;
  readonly todoItem: Locator;
  readonly addTodoBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filters = new FiltersComponent(page);
    this.todoItem = page.getByTestId("todo-item");
    this.addTodoBtn = page.getByTestId("add-todo-button");
  }

  async clickAddTodoBtn() {
    await this.addTodoBtn.click();
  }
}
