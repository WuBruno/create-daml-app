import {
  Council,
  ProposalAction,
} from "@daml.js/create-daml-app/lib/Governance";
import { ContractId } from "@daml/types";
import React, { useState } from "react";
import { Button, Form, Tab } from "semantic-ui-react";
import { userContext } from "../App";

type Props = {
  initialConstitution: string;
  onSubmit: () => void;
  councilId: ContractId<Council>;
};

const UpdateConstitution = ({
  initialConstitution,
  onSubmit,
  councilId,
}: Props) => {
  const [constitution, setConstitution] = useState(initialConstitution);
  const ledger = userContext.useLedger();
  const party = userContext.useParty();

  const handleSubmit = async () => {
    const proposalAction: ProposalAction = {
      tag: "UpdateConstitutionAction",
      value: { _1: councilId, _2: constitution },
    };

    await ledger.exercise(Council.CreateProposal, councilId, {
      proposalAction: proposalAction,
      proposer: party,
    });

    onSubmit();
  };

  return (
    <Tab.Pane>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Constitution</label>
          <input
            placeholder="Constitution"
            value={constitution}
            onChange={(e) => setConstitution(e.target.value)}
          />
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Form>
    </Tab.Pane>
  );
};

export default UpdateConstitution;
