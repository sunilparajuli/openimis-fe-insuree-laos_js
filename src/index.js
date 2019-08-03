import InsureeMainMenu from "./components/InsureeMainMenu";
import { CreatePage } from "./components/CreatePage";
import { FamiliesPage } from "./components/FamiliesPage";
import { InsureesPage } from "./components/InsureesPage";
import { CappedItemServicePage } from "./components/CappedItemServicePage";
import { ProfilePage } from "./components/ProfilePage";
import Enquiry from "./components/Enquiry";
import InsureeAvatar from "./components/InsureeAvatar";
import InsureeFamilySummary from "./components/InsureeFamilySummary";
import InsureeCappedItemServiceLink from "./components/InsureeCappedItemServiceLink";
import InsureeProfileLink from "./components/InsureeProfileLink";
import InsureeSummary from "./components/InsureeSummary";
import InsureeFirstServicePoint from "./components/InsureeFirstServicePoint";
import messages_en from "./translations/en.json";
import reducer from "./reducer";

const DEFAULT_CONFIG = {
  "translations": [{ key: 'en', messages: messages_en }],
  "reducers": [{ key: 'insuree', reducer: reducer }],  
  "components": [
    {key: "insuree.Avatar", component: InsureeAvatar },
    {key: "insuree.Summary", component: InsureeSummary },
    {key: "insuree.FirstServicePoint", component: InsureeFirstServicePoint },
    {key: "insuree.FamilySummary", component: InsureeFamilySummary },
    {key: "insuree.ProfileLink", component: InsureeProfileLink },
    {key: "insuree.CappedItemServiceLink", component: InsureeCappedItemServiceLink },
  ],  
  "core.Router": [
    { path: "insuree/create", component: CreatePage },
    { path: "insuree/families", component: FamiliesPage },
    { path: "insuree/insurees", component: InsureesPage },
    { path: "insuree/cappedItemService", component: CappedItemServicePage },
    { path: "insuree/profile", component: ProfilePage },
  ],
  "core.AppBar": [Enquiry],
  "core.MainMenu": [InsureeMainMenu],
  "insuree.InsureeSummaryAvatar": [InsureeAvatar],
  "insuree.InsureeSummaryExt": [InsureeFirstServicePoint],
}

export const InsureeModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}

