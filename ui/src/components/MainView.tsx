// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { User } from "@daml.js/create-daml-app";
import { Party } from "@daml/types";
import React, { useMemo } from "react";
import {
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Segment,
} from "semantic-ui-react";
import { publicContext, userContext } from "./App";
import Council from "./Council";
import PartyListEdit from "./PartyListEdit";
import Proposals from "./proposals/Proposals";

// USERS_BEGIN
const MainView: React.FC = () => {
  const username = userContext.useParty();

  const myUserResult = userContext.useStreamFetchByKeys(
    User.User,
    () => [username],
    [username]
  );
  const aliases = publicContext.useStreamQueries(User.Alias, () => [], []);
  const myUser = myUserResult.contracts[0]?.payload;
  const allUsers = userContext.useQuery(User.User).contracts;
  // USERS_END

  // Map to translate party identifiers to aliases.
  const partyToAlias = useMemo(
    () =>
      new Map<Party, string>(
        aliases.contracts.map(({ payload }) => [
          payload.username,
          payload.alias,
        ])
      ),
    [aliases]
  );
  const myUserName = aliases.loading
    ? "loading ..."
    : partyToAlias.get(username) ?? username;

  // FOLLOW_BEGIN
  const ledger = userContext.useLedger();

  const follow = async (userToFollow: Party): Promise<boolean> => {
    try {
      await ledger.exerciseByKey(User.User.Follow, username, { userToFollow });
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  };
  // FOLLOW_END

  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header
              as="h1"
              size="huge"
              color="blue"
              textAlign="center"
              style={{ padding: "1ex 0em 0ex 0em" }}
            >
              {myUserName ? `Welcome, ${myUserName}!` : "Loading..."}
            </Header>

            <Segment>
              <Header as="h2">
                <Icon name="user" />
                <Header.Content>
                  {myUserName ?? "Loading..."}
                  <Header.Subheader>Users I'm following</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <PartyListEdit
                parties={myUser?.following ?? []}
                partyToAlias={partyToAlias}
                onAddParty={follow}
              />
            </Segment>

            <Segment>
              <Header as="h2">
                <Icon name="balance scale" />
                <Header.Content>ICVCM Council</Header.Content>
              </Header>
              <Divider />
              <Council partyToAlias={partyToAlias} />
            </Segment>

            <Segment>
              <Header as="h2">
                <Icon name="edit" />
                <Header.Content>Proposals</Header.Content>
              </Header>
              <Divider />
              <Proposals partyToAlias={partyToAlias} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default MainView;
