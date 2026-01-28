import { Locator, Page } from "@playwright/test";

export type Status = "All Statuses" | "Pending" | "In Progress" | "Completed";
export type Priority = "All Priorities" | "Low" | "Medium" | "High";

export class FiltersComponent {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly statusSelect: Locator;
  readonly prioritySelect: Locator;
  readonly clearFilterBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByRole("textbox", { name: "search" });
    this.statusSelect = page.getByRole("combobox", { name: "status" });
    this.prioritySelect = page.getByRole("combobox", { name: "priority" });
    this.clearFilterBtn = page.getByRole("button", { name: "Clear" });
  }

  async search(searchText: string) {
    await this.searchInput.fill(searchText);
  }

  async selectStatus(status: Status) {
    await this.statusSelect.selectOption(status);
  }

  async selectPriority(priority: Priority) {
    await this.prioritySelect.selectOption(priority);
  }

  async clearFilters() {
    await this.clearFilterBtn.click();
  }
}
