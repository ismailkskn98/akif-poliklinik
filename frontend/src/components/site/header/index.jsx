import { getTreatmentCopy } from "@/content/treatmentCopy";
import {
  getTreatmentHref,
  getTreatmentsByCategory,
  treatmentCategories,
} from "@/content/treatments";
import { getPublicSiteSettings } from "@/lib/siteSettings";

import NavigationShell from "./navigationShell";

export default async function Header({ locale }) {
  const content = getTreatmentCopy(locale);
  const settings = await getPublicSiteSettings();
  const groups = treatmentCategories.map((category) => ({
    key: category,
    label: content.categories[category][0],
    items: getTreatmentsByCategory(category).map((treatment) => ({
      key: treatment.key,
      label: content.items[treatment.key][0],
      href: getTreatmentHref(treatment, locale),
      image: treatment.image,
    })),
  }));

  return (
    <NavigationShell
      currentLocale={locale}
      groups={groups}
      labels={content.ui}
      settings={settings}
    />
  );
}
