import InsureeMainMenu from "./menus/InsureeMainMenu";
import FamiliesPage from "./pages/FamiliesPage";
import InsureePage from "./pages/InsureePage";
import FamilyPage from "./pages/FamilyPage";
import { CappedItemServicePage } from "./pages/CappedItemServicePage";
import InsureesPage from "./pages/InsureesPage";
import { ProfilePage } from "./pages/ProfilePage";
import FamilyOverviewPage from "./pages/FamilyOverviewPage";
import Enquiry from "./components/Enquiry";
import InsureePicker from "./pickers/InsureePicker";
import InsureeChfIdPicker from "./pickers/InsureeChfIdPicker";
import InsureeGenderPicker from "./pickers/InsureeGenderPicker";
import EducationPicker from "./pickers/EducationPicker";
import ProfessionPicker from "./pickers/ProfessionPicker";
import IdentificationTypePicker from "./pickers/IdentificationTypePicker";
import InsureeMaritalStatusPicker from "./pickers/InsureeMaritalStatusPicker";
import FamilyPovertyStatusPicker from "./pickers/FamilyPovertyStatusPicker";
import ConfirmationTypePicker from "./pickers/ConfirmationTypePicker";
import FamilyTypePicker from "./pickers/FamilyTypePicker";
import PhotoStatusPicker from "./pickers/PhotoStatusPicker";
import InsureeAvatar from "./components/InsureeAvatar";
import InsureeFamilySummary from "./components/InsureeFamilySummary";
import InsureeCappedItemServiceLink from "./components/InsureeCappedItemServiceLink";
import InsureeProfileLink from "./components/InsureeProfileLink";
import InsureeSummary from "./components/InsureeSummary";
import InsureeFirstServicePointCondensed from "./components/InsureeFirstServicePointCondensed";
import InsureeFirstServicePointPanel from "./components/InsureeFirstServicePointPanel";
import InsureeAddress from "./components/InsureeAddress";
import messages_en from "./translations/en.json";
import reducer from "./reducer";
import InsureeForm from "./components/InsureeForm";


const ROUTE_INSUREE_FAMILIES = "insuree/families";
const ROUTE_INSUREE_INSUREE = "insuree/insuree";
const ROUTE_INSUREE_FIND_INSUREE = "insuree/insurees";
const ROUTE_INSUREE_FIND_FAMILY = "insuree/families";
const ROUTE_INSUREE_FAMILY_OVERVIEW = "insuree/familyOverview";
const ROUTE_INSUREE_FAMILY = "insuree/family";

const DEFAULT_CONFIG = {
  "translations": [{ key: 'en', messages: messages_en }],
  "reducers": [{ key: 'insuree', reducer }],
  "refs": [
    { key: "insuree.InsureePicker", ref: InsureePicker },
    { key: "insuree.InsureeChfIdPicker", ref: InsureeChfIdPicker },
    { key: "insuree.InsureePicker.projection", ref: ["id", "chfId", "lastName", "otherNames"] },
    { key: "insuree.InsureeGenderPicker", ref: InsureeGenderPicker },
    { key: "insuree.InsureeMaritalStatusPicker", ref: InsureeMaritalStatusPicker },
    { key: "insuree.EducationPicker", ref: EducationPicker },
    { key: "insuree.ProfessionPicker", ref: ProfessionPicker },
    { key: "insuree.IdentificationTypePicker", ref: IdentificationTypePicker },
    { key: "insuree.FamilyPovertyStatusPicker", ref: FamilyPovertyStatusPicker },
    { key: "insuree.ConfirmationTypePicker", ref: ConfirmationTypePicker },
    { key: "insuree.FamilyTypePicker", ref: FamilyTypePicker },
    { key: "insuree.PhotoStatusPicker", ref: PhotoStatusPicker },

    { key: "insuree.route.findFamily", ref: ROUTE_INSUREE_FIND_FAMILY },
    { key: "insuree.route.familyOverview", ref: ROUTE_INSUREE_FAMILY_OVERVIEW },
    { key: "insuree.route.family", ref: ROUTE_INSUREE_FAMILY },
    { key: "insuree.route.findInsuree", ref: ROUTE_INSUREE_FIND_INSUREE },
    { key: "insuree.route.insuree", ref: ROUTE_INSUREE_INSUREE },

    { key: "insuree.Avatar", ref: InsureeAvatar },
    { key: "insuree.Summary", ref: InsureeSummary },
    { key: "insuree.InsureeFirstServicePointCondensed", ref: InsureeFirstServicePointCondensed },
    { key: "insuree.InsureeFirstServicePointPanel", ref: InsureeFirstServicePointPanel },
    { key: "insuree.FamilySummary", ref: InsureeFamilySummary },
    { key: "insuree.InsureeAddress", ref: InsureeAddress },
    { key: "insuree.ProfileLink", ref: InsureeProfileLink },
    { key: "insuree.CappedItemServiceLink", ref: InsureeCappedItemServiceLink },
  ],
  "core.Router": [
    { path: ROUTE_INSUREE_FAMILIES, component: FamiliesPage },
    { path: ROUTE_INSUREE_FAMILY + "/:family_uuid?", component: FamilyPage },
    { path: ROUTE_INSUREE_FAMILY_OVERVIEW + "/:family_uuid", component: FamilyOverviewPage },
    { path: ROUTE_INSUREE_INSUREE + "/:insuree_uuid/:family_uuid?", component: InsureePage },
    { path: "insuree/insurees", component: InsureesPage },
    { path: "insuree/cappedItemService", component: CappedItemServicePage },
    { path: "insuree/profile", component: ProfilePage },
  ],
  "core.AppBar": [Enquiry],
  "core.MainMenu": [InsureeMainMenu],
  "insuree.InsureeSummaryAvatar": [InsureeAvatar],
  "insuree.InsureeSummaryExt": [InsureeFirstServicePointCondensed],
  "insuree.InsureePage.panels": [InsureeForm, InsureeFirstServicePointPanel],
}

export const InsureeModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}

