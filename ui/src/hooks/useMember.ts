import { Governance } from "@daml.js/create-daml-app";
import { useMemo } from "react";
import { userContext } from "../components/App";

export enum Roles {
  Director,
  Expert,
  Regulator,
  None,
}

const useMember = () => {
  const party = userContext.useParty();
  const council = userContext.useStreamQueries(Governance.Council).contracts;

  const directors =
    council.length &&
    council[0].payload.directors.map.entriesArray().map((d) => d[0]);

  const regulator = council.length && council[0].payload.regulator;

  const experts =
    council.length &&
    council[0].payload.experts.map.entriesArray().map((d) => d[0]);

  const role = useMemo(() => {
    if (directors && directors.includes(party)) {
      return Roles.Director;
    }
    if (experts && experts.includes(party)) {
      return Roles.Expert;
    }
    if (regulator === party) {
      return Roles.Regulator;
    }
    return Roles.None;
  }, [directors, party, experts, regulator]);

  return {
    party,
    directors,
    regulator,
    experts,
    role,
  };
};

export default useMember;
