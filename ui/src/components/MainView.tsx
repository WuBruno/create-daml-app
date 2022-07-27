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
import useMember, { Roles } from "../hooks/useMember";
import { publicContext, userContext } from "./App";
import Council from "./Council";
import Proposals from "./proposals/Proposals";

// USERS_BEGIN
const MainView: React.FC = () => {
  const username = userContext.useParty();
  const aliases = publicContext.useStreamQueries(User.Alias, () => [], []);
  const { role } = useMember();
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
                  <Header.Subheader>{Roles[role]}</Header.Subheader>
                </Header.Content>
              </Header>
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
