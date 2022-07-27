// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { Governance } from "@daml.js/create-daml-app";
import { Party } from "@daml/types";
import React, { useState } from "react";
import { Button, Modal, Tab } from "semantic-ui-react";
import { userContext } from "../App";
import AddDirector from "./AddDirector";
import ProposalList from "./ProposalList";
import UpdateConstitution from "./UpdateConstitution";

type Props = {
  partyToAlias: Map<Party, string>;
};

const Proposals: React.FC<Props> = ({ partyToAlias }) => {
  const { contracts, loading } = userContext.useStreamQueries(
    Governance.Council
  );
  const [open, setOpen] = useState(false);

  if (!loading && contracts.length) {
    const council = contracts[0].payload;
    const councilId = contracts[0].contractId;
    const panes = [
      {
        menuItem: "Update Constitution",
        render: () => (
          <UpdateConstitution
            initialConstitution={council.constitution}
            onSubmit={() => setOpen(false)}
            councilId={councilId}
          />
        ),
      },
      {
        menuItem: "Add Director",
        render: () => (
          <AddDirector
            partyToAlias={partyToAlias}
            onSubmit={() => setOpen(false)}
            councilId={councilId}
          />
        ),
      },
      { menuItem: "Add Expert", render: undefined },
    ];

    return (
      <div>
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={<Button>Propose</Button>}
        >
          <Modal.Header>Make New Proposal</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Tab panes={panes} />
            </Modal.Description>
          </Modal.Content>
        </Modal>
        <ProposalList partyToAlias={partyToAlias} />
      </div>
    );
  }

  return null;
};

export default Proposals;
