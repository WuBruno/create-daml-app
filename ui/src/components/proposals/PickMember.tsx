// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { Party } from "@daml/types";
import React from "react";
import { Button, Form, Tab } from "semantic-ui-react";
import useMember from "../../hooks/useMember";

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
  const { directors, experts, regulator } = useMember();

  const aliasToOption = (party: string, alias: string) => {
    return { key: party, text: alias, value: party };
  };

  const options =
    !directors || !experts
      ? []
      : Array.from(partyToAlias.entries())
          .filter((party) => !directors.includes(party[0]))
          .filter((party) => !experts.includes(party[0]))
          .filter((party) => regulator !== party[0])
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
