import { Page, Locator } from '@playwright/test';

export class NotFoundPage {
  readonly container: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.container = page.getByTestId('error-page');
    this.heading = this.container.getByRole('heading', { level: 2, name: /page you're looking for has been moved/i });
  }
}
