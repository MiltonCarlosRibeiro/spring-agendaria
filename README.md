# 📘 Spring-Agendaria – Sistema de Agendamentos para Microempreendedores

**Agendaria** é uma aplicação moderna de agendamentos desenvolvida com **Spring Boot 3**, **SQLite**, **Flyway**, e **HTML/JS/CSS** no frontend, voltada para profissionais autônomos, esteticistas, barbearias e pequenos negócios.

Ela permite gerenciar **clientes, procedimentos e agendamentos** através de uma API RESTful simples, robusta e escalável.

---

## 🚀 Tecnologias Utilizadas

| Camada     | Tecnologia                                        |
|------------|--------------------------------------------------|
| Backend    | Spring Boot 3.3, Spring Web, Spring Data JPA     |
| Banco      | SQLite + Flyway                                  |
| Validação  | Spring Validation                                |
| API        | RESTful                                           |
| Front-end  | HTML5 + CSS3 + JavaScript                        |
| Build      | Maven                                             |
| Logging    | SLF4J + Logback                                  |

---

## 📁 Estrutura do Projeto

agendaria/
├── src/
│ ├── main/
│ │ ├── java/com/agendaria/agendaria/
│ │ │ ├── domain/
│ │ │ ├── repository/
│ │ │ ├── service/
│ │ │ └── web/
│ │ └── resources/
│ │ ├── db/migration/ <-- Flyway migrations
│ │ ├── static/ <-- Front-end (HTML/CSS/JS)
│ │ └── application.yml
├── data/agendaria.db <-- Banco SQLite
├── pom.xml
└── README.md

yaml
Copiar código

---

## 🗄️ Banco de Dados (SQLite)

O esquema é criado automaticamente via **Flyway** na primeira execução.

### Script `V1__init.sql` define:
- `businesses`
- `customers`
- `procedures`
- `appointments`

> ⚠️ Um `Business` padrão é criado com ID `1` automaticamente.

---

## 🔌 Endpoints da API

### 👉 Agendamentos

| Método | Rota                                    | Descrição                                      |
|--------|-----------------------------------------|------------------------------------------------|
| POST   | `/api/appointments/next`               | Agenda no próximo horário disponível           |
| POST   | `/api/appointments/{id}/cancel`        | Cancela o agendamento                          |
| POST   | `/api/appointments/{id}/reschedule-next` | Cancela e cria novo no próximo horário       |
| GET    | `/api/appointments/next-list`          | Lista próximos agendamentos                    |

### 👉 Clientes

| Método | Rota                    |
|--------|-------------------------|
| GET    | `/api/customers`       |
| POST   | `/api/customers`       |
| DELETE | `/api/customers/{id}`  |

### 👉 Procedimentos

| Método | Rota                    |
|--------|-------------------------|
| GET    | `/api/procedures`      |
| POST   | `/api/procedures`      |
| DELETE | `/api/procedures/{id}` |

---

## ▶️ Como Rodar Localmente

1. **Clone o repositório**  
   ```bash
   git clone https://github.com/sua-conta/agendaria.git
   cd agendaria
