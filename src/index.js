import { InsureeMainMenu } from "./components/InsureeMainMenu";
import { CreatePage } from "./components/CreatePage";
import { FamiliesPage } from "./components/FamiliesPage";
import { InsureesPage } from "./components/InsureesPage";
import { PoliciesPage } from "./components/PoliciesPage";
import { ContributionsPage } from "./components/ContributionsPage";
import { insureeSearcherByID } from "./components/InsureeMainSearchers";

const InsureeModule = {
  "core.Router": [
    { path: "insuree/create", component: CreatePage },
    { path: "insuree/families", component: FamiliesPage },
    { path: "insuree/insurees", component: InsureesPage },
    { path: "insuree/policies", component: PoliciesPage },
    { path: "insuree/contributions", component: ContributionsPage },
  ],
  "core.MainMenu": [InsureeMainMenu],
  "core.MainSearcher": [
    { label: "Insuree ID", searcher: insureeSearcherByID }
  ]  
}

export { InsureeModule };
