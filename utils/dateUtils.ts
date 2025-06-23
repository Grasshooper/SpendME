export const DateUtils = {
  getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  },

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  },

  getWeekStart(date: Date = new Date()): Date {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  },

  getWeekEnd(date: Date = new Date()): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + 6;
    return new Date(date.setDate(diff));
  },

  isToday(dateString: string): boolean {
    return dateString === this.getTodayString();
  },

  daysSince(dateString: string): number {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  },
};