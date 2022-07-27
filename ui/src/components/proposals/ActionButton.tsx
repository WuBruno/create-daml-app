import { Governance } from "@daml.js/create-daml-app";
import {
  Proposal,
  ProposalStatus,
} from "@daml.js/create-daml-app/lib/Governance";
import { ContractId } from "@daml/types";
import React from "react";
import { Button, Form } from "semantic-ui-react";
import useMember, { Roles } from "../../hooks/useMember";
import { userContext } from "../App";

type Props = {
  proposal: Proposal;
  proposalId: ContractId<Proposal>;
};

const ActionButton = ({ proposal, proposalId }: Props) => {
  const { party, role } = useMember();
  const ledger = userContext.useLedger();

  const hasVoted = proposal.voted.map
    .entriesArray()
    .map((x) => x[0])
    .includes(party);

  const vote = async (accept: boolean) =>
    ledger.exercise(Governance.Proposal.Vote, proposalId, {
      director: party,
      accept,
    });

  const decide = async (accept: boolean) =>
    ledger.exercise(Governance.Proposal.Decide, proposalId, {
      accept,
    });

  if (role === Roles.Regulator) {
    if (proposal.status === ProposalStatus.Voting) {
      return (
        <Button color="red" onClick={() => decide(false)}>
          Reject
        </Button>
      );
    }
    if (proposal.status === ProposalStatus.Review) {
      return (
        <Form>
          <Form.Button color="green" onClick={() => decide(true)}>
            Accept
          </Form.Button>
          <Form.Button color="red" onClick={() => decide(false)}>
            Reject
          </Form.Button>
        </Form>
      );
    }
  }

  if (hasVoted) {
    return <Button disabled>Voted</Button>;
  }

  if (proposal.status === ProposalStatus.Voting && role === Roles.Director) {
    return (
      <Form>
        <Form.Button color="green" onClick={() => vote(true)}>
          For
        </Form.Button>
        <Form.Button color="red" onClick={() => vote(false)}>
          Against
        </Form.Button>
      </Form>
    );
  }

  return <Button disabled>N/A</Button>;
};

export default ActionButton;
