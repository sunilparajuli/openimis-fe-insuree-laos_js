import InsureeMainMenu from "./components/InsureeMainMenu";
import { CreatePage } from "./components/CreatePage";
import FamiliesPage from "./pages/FamiliesPage";
import FamilyOverviewPage from "./pages/FamilyOverviewPage";
import { InsureesPage } from "./components/InsureesPage";
import { CappedItemServicePage } from "./components/CappedItemServicePage";
import { ProfilePage } from "./components/ProfilePage";
import Enquiry from "./components/Enquiry";
import InsureePicker from "./pickers/InsureePicker";
import InsureeChfIdPicker from "./pickers/InsureeChfIdPicker";
import InsureeGenderPicker from "./pickers/InsureeGenderPicker";
import FamilyPovertyStatusPicker from "./pickers/FamilyPovertyStatusPicker";
import ConfirmationTypePicker from "./pickers/ConfirmationTypePicker";
import FamilyTypePicker from "./pickers/FamilyTypePicker";
import InsureeAvatar from "./components/InsureeAvatar";
import InsureeFamilySummary from "./components/InsureeFamilySummary";
import InsureeCappedItemServiceLink from "./components/InsureeCappedItemServiceLink";
import InsureeProfileLink from "./components/InsureeProfileLink";
import InsureeSummary from "./components/InsureeSummary";
import InsureeFirstServicePoint from "./components/InsureeFirstServicePoint";
import messages_en from "./translations/en.json";
import reducer from "./reducer";
import FamilyInsureesOverview from "./components/FamilyInsureesOverview";

const ROUTE_INSUREE_FAMILIES = "insuree/families";
const ROUTE_INSUREE_FAMILY_OVERVIEW = "insuree/familyOverview";

const DEFAULT_CONFIG = {
  "translations": [{ key: 'en', messages: messages_en }],
  "reducers": [{ key: 'insuree', reducer }],
  "refs": [
    { key: "insuree.InsureePicker", ref: InsureePicker },
    { key: "insuree.InsureeChfIdPicker", ref: InsureeChfIdPicker },
    { key: "insuree.InsureePicker.projection", ref: ["id", "chfId", "lastName", "otherNames"] },
    { key: "insuree.InsureeGenderPicker", ref: InsureeGenderPicker },
    { key: "insuree.FamilyPovertyStatusPicker", ref: FamilyPovertyStatusPicker },
    { key: "insuree.ConfirmationTypePicker", ref: ConfirmationTypePicker },
    { key: "insuree.FamilyTypePicker", ref: FamilyTypePicker },

    { key: "insuree.route.familyOverview", ref: ROUTE_INSUREE_FAMILY_OVERVIEW },

    { key: "insuree.Avatar", ref: InsureeAvatar },
    { key: "insuree.Summary", ref: InsureeSummary },
    { key: "insuree.FirstServicePoint", ref: InsureeFirstServicePoint },
    { key: "insuree.FamilySummary", ref: InsureeFamilySummary },
    { key: "insuree.ProfileLink", ref: InsureeProfileLink },
    { key: "insuree.CappedItemServiceLink", ref: InsureeCappedItemServiceLink },
  ],
  "core.Router": [
    { path: "insuree/create", component: CreatePage },
    { path: ROUTE_INSUREE_FAMILIES, component: FamiliesPage },
    { path: ROUTE_INSUREE_FAMILY_OVERVIEW + "/:family_uuid", component: FamilyOverviewPage },
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

