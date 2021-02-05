# Event Manager

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

The Event Manager is composed of multiple actions including using a database to store trigger URLs and their respective auth, and Kafka provider, consumer, and producer. Once the event manager receives an event from the event feed, this data is produced to a topic. The feed action in the manager lets the user hook into the system. That is, once an event is indexed to a particular topic, it can invoke a particular action. While creating the workflow, users can choose the event trigger as feed and provide necessary parameters from which chain it should be listening to.

#### Prerequisites

1. [Openwhisk](./docs/dependencies/openwhisk/)

### Components

#### Actions

* Event Receiver

This action receives events from the event feed and propagates to the system.

### Installation

Assuming basic dependency such as [git](https://git-scm.com/) and [yarn](https://yarnpkg.com/) already installed.

1. Clone the repository

```text
git clone https://github.com/HugoByte/aurras-event-manager.git
```

  2. Navigate to the cloned directory

```text
cd aurras-event-manager
```

  3. Deploy the actions using the deploy script. The script supports optional parameters which can be found [here](./docs/configuration.md).

```text
./deploy.sh
```

### License

Licensed under [Apache-2.0](https://github.com/HugoByte/aurras-documentation/tree/f07f6727f0cb01cccf04f15ec446e2d310ca1cb9/components/event-feed/substrate-event-feed/LICENSE/README.md)
