class Localization {
  locale = "";

  constructor(locale) {
    this.locale = locale;
  }

  formatNumber(number) {
    return new Intl.NumberFormat(this.locale).format(number);
  }
}
