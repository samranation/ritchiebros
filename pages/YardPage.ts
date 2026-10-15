import { Page, Locator } from '@playwright/test';
import { PHONE_NUMBER } from '../helpers/patterns';

export interface CategoryCard {
  name: string;
  quantity: string;
}

export interface Representative {
  name: string;
  territory: string;
  /** First phone / mobile / email link on the card. */
  contact: string;
}

const CONTACT_LINK = /^(Call|Send email to) /;

export class YardPage {
  readonly main: Locator;
  readonly heading: Locator;
  readonly detailsTab: Locator;
  readonly representativesTab: Locator;
  readonly representativesPanel: Locator;
  readonly representativeNames: Locator;
  readonly contactPhone: Locator;
  readonly auctionEventsHeading: Locator;
  readonly eventCards: Locator;
  readonly aboutHeading: Locator;
  readonly aboutNotice: Locator;
  readonly itemsInYardHeading: Locator;
  readonly categoryCards: Locator;
  readonly becomeSellerHeading: Locator;
  readonly sellerForm: Locator;
  readonly sellerPhone: Locator;

  constructor(
    private readonly page: Page,
    readonly yardName = 'Edmonton',
  ) {
    this.main = page.getByRole('main');
    this.heading = this.main.getByRole('heading', { level: 3, name: yardName, exact: true });
    this.detailsTab = this.main.getByRole('tab', { name: 'Details' });
    this.representativesTab = this.main.getByRole('tab', { name: 'Representatives' });
    this.representativesPanel = this.main.getByRole('tabpanel', { name: 'Representatives', exact: true });
    this.representativeNames = this.representativesPanel.getByRole('heading', { level: 4 });
    this.contactPhone = page.getByTestId('contact-phone-link');
    this.auctionEventsHeading = this.main.getByRole('heading', { level: 4, name: 'Auction events' });
    this.eventCards = page.getByTestId(/^auction-card-\d+$/); //strict so it only picks up cards with numbers after them
    this.aboutHeading = this.main.getByRole('heading', { level: 4, name: 'About this yard' });
    this.aboutNotice = this.main.getByRole('paragraph').filter({ hasText: /^Please note:\s*This auction site's yard/ });
    this.itemsInYardHeading = this.main.getByRole('heading', { level: 4, name: 'Items in yard' });
    this.categoryCards = this.main.getByRole('link').filter({ has: page.getByRole('heading', { level: 6 })})
    this.becomeSellerHeading = this.main.getByRole('heading', { name: 'Become a seller' });
    this.sellerForm = page.getByTestId('seller-form-body');
    this.sellerPhone = this.sellerForm.getByRole('link', { name: PHONE_NUMBER });
  }

  async goto(path = '/lp/edmonton-ab') {
    await this.page.goto(path);
  }

  eventDateRange(card: Locator): Locator {
    return card.getByTestId(/^auction-card-date-range-\d+$/);
  }

  eventTitle(card: Locator): Locator {
    return card.getByRole('heading', { level: 5 });
  }

  async categoryCardContents(): Promise<CategoryCard[]> {
    const cards: CategoryCard[] = [];
    const cardsAll = await this.categoryCards.all();
    for (const card of cardsAll) {
      cards.push({
        name: (await card.getByRole('heading', { level: 6 }).innerText()).trim(),
        quantity: (await card.getByRole('paragraph').innerText()).trim(),
      });
    }
    return cards;
  }

  async representatives(): Promise<Representative[]> {
    const representatives: Representative[] = [];

    const heading = this.page.getByRole('heading', { level: 4 });
    const contact = this.page.getByRole('link', { name: CONTACT_LINK });
    const hasBoth = (l: Locator) => l.filter({ has: heading }).filter({ has: contact });

    const cards = hasBoth(this.representativesPanel.locator('div')).filter({ hasNot: hasBoth(this.page.locator('div')) });

    const cardsAll = await cards.all();

    for(const card of cardsAll) {
      representatives.push({
        name: (await card.getByRole('heading', { level: 4 }).innerText()).trim(),
        territory: (await card.getByRole('heading', { level: 6 }).first().innerText()).trim(),
        contact: (await card.getByRole('link', { name: CONTACT_LINK }).first().innerText()).trim(),
      });
    }

    return representatives;
  }
}
