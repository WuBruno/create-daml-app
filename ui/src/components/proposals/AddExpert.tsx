import {
  Council,
  ProposalAction,
} from "@daml.js/create-daml-app/lib/Governance";
import { ContractId, Party } from "@daml/types";
import React from "react";
import { userContext } from "../App";
import PickMember from "./PickMember";

type Props = {
  partyToAlias: Map<Party, string>;
  onSubmit: () => void;
  councilId: ContractId<Council>;
};

const AddExpert = ({ partyToAlias, onSubmit, councilId }: Props) => {
  const ledger = userContext.useLedger();
  const party = userContext.useParty();

  const handleSubmit = async (user: Party) => {
    const proposalAction: ProposalAction = {
      tag: "AddExpertAction",
      value: { _1: councilId, _2: user },
    };

    await ledger.exercise(Council.CreateProposal, councilId, {
      proposalAction: proposalAction,
      proposer: party,
    });

    onSubmit();

    return true;
  };

  return <PickMember partyToAlias={partyToAlias} onSubmit={handleSubmit} />;
};

export default AddExpert;
