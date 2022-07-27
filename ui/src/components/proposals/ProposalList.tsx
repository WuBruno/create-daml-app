import {
  Proposal,
  ProposalAction,
} from "@daml.js/create-daml-app/lib/Governance";
import { Party } from "@daml/types";
import React from "react";
import { Table } from "semantic-ui-react";
import { userContext } from "../App";

type Props = {
  partyToAlias: Map<Party, string>;
};

const ProposalList = ({ partyToAlias }: Props) => {
  const { contracts, loading } = userContext.useStreamQueries(Proposal);

  if (loading) {
    return null;
  }

  const parseProposalAction = (proposalAction: ProposalAction) => {
    const value = proposalAction.value._2;

    switch (proposalAction.tag) {
      case "AddDirectorAction":
        return `Adding Director ${partyToAlias.get(value)}`;
      case "AddExpertAction":
        return `Adding Expert ${partyToAlias.get(value)}`;
      case "UpdateConstitutionAction":
        return `Update Constitution: ${value}`;
    }
  };

  return (
    <Table celled padded>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell singleLine>Proposal</Table.HeaderCell>
          <Table.HeaderCell>Proposer</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {contracts &&
          contracts.map(({ payload, contractId }) => (
            <Table.Row key={contractId}>
              <Table.Cell>
                {parseProposalAction(payload.proposalAction)}
              </Table.Cell>
              <Table.Cell>{partyToAlias.get(payload.proposer)}</Table.Cell>
              <Table.Cell>{payload.status}</Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

export default ProposalList;
