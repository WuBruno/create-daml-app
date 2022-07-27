// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { Governance } from "@daml.js/create-daml-app";
import { Party } from "@daml/types";
import React from "react";
import { Button, Form, Tab } from "semantic-ui-react";
import { userContext } from "../App";

type Props = {
  partyToAlias: Map<Party, string>;
  onSubmit: (party: Party) => Promise<boolean>;
};

/**
 * React component to edit a list of `Party`s.
 */
const PickMember: React.FC<Props> = ({ partyToAlias, onSubmit }) => {
  const [newParty, setNewParty] = React.useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const council = userContext.useQuery(Governance.Council).contracts;

  const aliasToOption = (party: string, alias: string) => {
    return { key: party, text: alias, value: party };
  };
  const options = !council.length
    ? []
    : Array.from(partyToAlias.entries())
        .filter(
          (party) =>
            !council[0].payload.directors.map
              .entriesArray()
              .map((d) => d[0])
              .includes(party[0])
        )
        .filter(
          (party) =>
            !council[0].payload.experts.map
              .entriesArray()
              .map((d) => d[0])
              .includes(party[0])
        )
        .filter((party) => council[0].payload.regulator !== party[0])
        .map((e) => aliasToOption(e[0], e[1]));

  const addParty = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const success = await onSubmit(newParty ?? "");
    setIsSubmitting(false);

    if (success) {
      setNewParty(undefined);
    }
  };

  return (
    <Tab.Pane>
      <Form onSubmit={addParty}>
        <Form.Field>
          <label>Pick new Director</label>
          <Form.Select
            fluid
            search
            allowAdditions
            additionLabel="Insert a party identifier: "
            additionPosition="bottom"
            readOnly={isSubmitting}
            loading={isSubmitting}
            className="test-select-follow-input"
            placeholder={newParty ?? "Username to follow"}
            value={newParty}
            options={options}
            onAddItem={(event, { value }) => setNewParty(value?.toString())}
            onChange={(event, { value }) => setNewParty(value?.toString())}
          />
        </Form.Field>
        <Button type="submit" className="test-select-follow-button">
          Submit
        </Button>
      </Form>
    </Tab.Pane>
  );
};

export default PickMember;
