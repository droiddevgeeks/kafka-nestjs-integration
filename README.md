<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Kafka-NestJS Integration

This project demonstrates the integration of **Apache Kafka** with **NestJS**, showcasing a robust event-driven architecture. It is designed to handle real-time messaging, distributed systems, and microservices communication efficiently. The project is a learning-oriented implementation with features that can be extended for production-grade systems.

---

## Features

- **Kafka Producer and Consumer**: 
  - Publish and consume messages from Kafka topics.
- **Dynamic Topic Subscription**: 
  - Subscribe to Kafka topics dynamically at runtime.
- **Error Handling**: 
  - Graceful handling of message processing failures with retry mechanisms.
- **Monitoring and Observability**: 
  - Basic metrics for Kafka message processing.
- **Scalable Architecture**: 
  - Designed to scale horizontally with multiple consumers.
- **Extensible Design**: 
  - Easily extendable for advanced Kafka features like DLQ, message filtering, and more.

---

## Prerequisites

- **Node.js**: v16 or higher
- **NestJS**: v9 or higher
- **Apache Kafka**: A running Kafka cluster
- **Docker** (optional): For running Kafka locally using Docker Compose

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/droiddevgeeks/kafka-nestjs-integration
cd kafka-nestjs-integration

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Configure Kafka
```
PORT=3000
KAFKA_CLIENT_ID=nestjs-kafka-client
KAFKA_BROKER=localhost:9092
KAFKA_TOPIC_PAYMENT=your-topic
KAFKA_DLQ_TOPIC=your-dql-topic
KAFKA_CONSUMER_GROUP_ID=nestjs-consumer-group
```

## Project Structure

```
src/
├── app.module.ts          # Main application module
├── kafka/                 # Kafka integration module
│   ├── kafka.module.ts    # Kafka module definition
│   ├── kafka.service.ts   # Kafka producer and consumer logic
│   └── kafka.controller.ts # Kafka topic and configuration constants
├── metrics/               # Metrics and monitoring
├── health/                # Shared utilities and helpers
└── main.ts                # Application entry point
```


## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
