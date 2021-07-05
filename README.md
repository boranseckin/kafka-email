# Kafka Email

## Initialization and Configuration

To start Kafka:
```
docker compose up -d
```

To configure partitions:
```
# Bash into the container
docker compose exec broker bash

# See the current amount of partitions
kafka-topics --topic [TOPIC] --describe --bootstrap-server [KAFKA_BOOTSTRAP_SERVER]

# Alter the topic to have as many partitions as needed
kafka-topics --topic [TOPIC] --alter --partitions 4 --bootstrap-server [KAFKA_BOOTSTRAP_SERVER]
```

To see the consumer group:
```
# Bash into the container
docker compose exec broker bash

kafka-consumer-groups --group [GROUP_ID] --describe --bootstrap-server [KAFKA_BOOTSTRAP_SERVER]
```

## Usage

Start one producer by running:
```js
node producer.js
```

Start as many consumers as the amount of partitions by running:
```js
node consumer.js
```
