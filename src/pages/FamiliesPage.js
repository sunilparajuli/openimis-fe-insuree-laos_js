import React, { Component } from "react";

import FamilySearcher from "../components/FamilySearcher";


class FamiliesPage extends Component {
    render() {
        return (
            <FamilySearcher
                cacheFiltersKey="insureeFamiliesPageFiltersCache"
            />
        )
    }
}

export { FamiliesPage };