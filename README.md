📘 Spring-Agendaria – Sistema de Agendamentos para Microempreendedores

Agendaria é uma aplicação moderna de agendamentos desenvolvida com Spring Boot 3, SQLite, Flyway, e HTML/JS/CSS no frontend, voltada para profissionais autônomos, esteticistas, barbearias e pequenos negócios.

Ela permite gerenciar clientes, procedimentos e agendamentos usando uma API simples, robusta e escalável.

🚀 Tecnologias Utilizadas
Camada	Tecnologia
Backend	Spring Boot 3.3, Spring Web, Spring Data JPA
Banco	SQLite + Flyway
Validação	Spring Validation
API	RESTful
Front-end	HTML5 + CSS3 + JavaScript
Build	Maven
Logging	SLF4J + Logback
📁 Estrutura do Projeto
agendaria/
 ├── src/
 │   ├── main/
 │   │   ├── java/com/agendaria/agendaria/
 │   │   │   ├── domain/
 │   │   │   ├── repository/
 │   │   │   ├── service/
 │   │   │   └── web/
 │   │   └── resources/
 │   │       ├── db/migration/   <-- Flyway migrations
 │   │       ├── static/         <-- Front-end (HTML/CSS/JS)
 │   │       └── application.yml
 ├── data/agendaria.db           <-- Banco SQLite
 ├── pom.xml
 └── README.md

🗄️ Banco de Dados (SQLite)

O esquema é criado automaticamente pelo Flyway:

V1__init.sql define:

businesses

customers

procedures

appointments

Business padrão é criado com ID 1.

🔌 Endpoints da API
👉 Agendamentos
Método	Rota	Descrição
POST	/api/appointments/next	Agenda automaticamente no próximo horário disponível
POST	/api/appointments/{id}/cancel	Cancela o agendamento
POST	/api/appointments/{id}/reschedule-next	Cancela e cria novo no próximo horário
GET	/api/appointments/next-list	Lista próximos agendamentos
👉 Clientes
Método	Rota
GET	/api/customers
POST	/api/customers
DELETE	/api/customers/{id}
👉 Procedimentos
Método	Rota
GET	/api/procedures
POST	/api/procedures
DELETE	/api/procedures/{id}
▶️ Como rodar
1. Clonar o repositório
git clone https://github.com/sua-conta/agendaria.git
cd agendaria

2. Certificar-se de que o Java 17 está instalado
java -version

3. Rodar a aplicação
mvn spring-boot:run


A API estará em:

👉 http://localhost:8080

🌱 Configurações do Banco (application.yml)
spring:
  datasource:
    url: jdbc:sqlite:./data/agendaria.db
    driver-class-name: org.sqlite.JDBC
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.sqlite.hibernate.dialect.SQLiteDialect
  flyway:
    enabled: true
    locations: classpath:db/migration

🎨 Front-end

O front está na pasta:

src/main/resources/static/


A página fica acessível em:

👉 http://localhost:8080/index.html

📌 Funcionalidades Principais

✔ Gestão de clientes
✔ Cadastro de procedimentos
✔ Agendamentos automáticos com lógica de disponibilidade
✔ Cancelamento + reagendamento automático
✔ Persistência local em SQLite
✔ Migrações automáticas com Flyway
✔ API organizada em DTOs, Services e Controllers

📄 Licença

MIT License — Livre para uso comercial ou pessoal.

🤝 Contribuições

Sinta-se livre para abrir PRs ou Issues!

Se quiser, posso gerar um README com prints e GIFs, ou criar também:

🔧 CI/CD
🐳 Dockerfile + Docker Compose
📊 Documentação Swagger
🏷️ Badge de cobertura de testes
