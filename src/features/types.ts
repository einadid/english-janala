import type { RouteContext } from '@/core/router';

export interface ViewDef {
  key: string;
  /** i18n key for the nav label */
  labelKey: string;
  icon: string;
  href: string;
  pattern: string;
  nav: boolean;
  render: (ctx: RouteContext) => string;
  after?: (ctx: RouteContext) => void;
}
