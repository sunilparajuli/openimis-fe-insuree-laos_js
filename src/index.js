import InsureeMainMenu from "./components/InsureeMainMenu";
import { CreatePage } from "./components/CreatePage";
import { FamiliesPage } from "./components/FamiliesPage";
import { InsureesPage } from "./components/InsureesPage";
import { CappedItemServicePage } from "./components/CappedItemServicePage";
import { ProfilePage } from "./components/ProfilePage";
import Enquiry from "./components/Enquiry";
import InsureeFamilySummary from "./components/InsureeFamilySummary";
import InsureeMoreLinks from "./components/InsureeMoreLinks";
import messages_en from "./translations/en.json";
import enquiry from "./reducers/insuree";

const DEFAULT_CONFIG = {
  "translations": [{ key: 'en', messages: messages_en }],
  "core.Router": [
    { path: "insuree/create", component: CreatePage },
    { path: "insuree/families", component: FamiliesPage },
    { path: "insuree/insurees", component: InsureesPage },
    { path: "insuree/cappedItemService", component: CappedItemServicePage },
    { path: "insuree/profile", component: ProfilePage },
  ],
  "core.AppBar": [Enquiry],
  "core.MainMenu": [InsureeMainMenu],
  "reducers": [{ key: 'insuree', reducer: enquiry }],
  "insuree.InsureeSummary": [InsureeMoreLinks, InsureeFamilySummary],
}

export const InsureeModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...(cfg && cfg['fe-insuree'] || {}) };
}