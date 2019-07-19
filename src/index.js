import InsureeMainMenu from "./components/InsureeMainMenu";
import { CreatePage } from "./components/CreatePage";
import { FamiliesPage } from "./components/FamiliesPage";
import { InsureesPage } from "./components/InsureesPage";
import { PoliciesPage } from "./components/PoliciesPage";
import { ContributionsPage } from "./components/ContributionsPage";
import Enquiry from "./components/Enquiry";
import messages_en from "./translations/en.json";
import enquiry from "./reducers/enquiry";

const InsureeModule = {
  "translations": [{key: 'en', messages: messages_en}],
  "core.Router": [
    { path: "insuree/create", component: CreatePage },
    { path: "insuree/families", component: FamiliesPage },
    { path: "insuree/insurees", component: InsureesPage },
    { path: "insuree/policies", component: PoliciesPage },
    { path: "insuree/contributions", component: ContributionsPage },
  ],
  "core.AppBar": [Enquiry],
  "core.MainMenu": [InsureeMainMenu],
  "reducers" : [{key: 'insuree', reducer: enquiry}],
}

export { InsureeModule };
