// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { Governance } from "@daml.js/create-daml-app";
import { Party } from "@daml/types";
import React from "react";
import { userContext } from "./App";

type Props = {
  partyToAlias: Map<Party, string>;
};

const Council: React.FC<Props> = ({ partyToAlias }) => {
  const { contracts, loading } = userContext.useStreamQueries(
    Governance.Council
  );

  if (!loading && contracts.length) {
    const { constitution, directors, experts, regulator } =
      contracts[0].payload;

    return (
      <div>
        <b>Constitution: </b>
        <p>{constitution}</p>
        <b>Regulator</b>
        <p>{partyToAlias.get(regulator)}</p>
        <b>Directors</b>
        <ul>
          {directors.map.entriesArray().map(([director, _]) => (
            <li key={director}>{partyToAlias.get(director)}</li>
          ))}
        </ul>
        <b>Experts</b>
        <ul>
          {experts.map.entriesArray().map(([expert, _]) => (
            <li key={expert}>{partyToAlias.get(expert)}</li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

export default Council;
