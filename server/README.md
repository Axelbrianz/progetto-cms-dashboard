# E-Commerce CMS - Backend API

> API RESTful per un sistema di gestione e-commerce costruito con Node.js, Express, TypeScript e MongoDB.

## 🚀 Tecnologie Utilizzate

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Validation**: Zod (input validation) + Mongoose Schema (database validation)
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Sharp (image processing)
- **Security**: bcryptjs (password hashing)

---

## 📁 Struttura del Progetto

```
server/
├── controllers/     # Business logic e gestione richieste
├── models/          # Mongoose schemas e interfacce TypeScript
├── routes/          # Definizione endpoint API
├── schemas/         # Zod validation schemas
├── middleware/      # Middleware personalizzati (auth, validation, upload)
├── utils/           # Utility functions (error handling, async wrapper)
└── index.ts         # Entry point dell'applicazione
```

---

## 🔑 Features Implementate

### Authentication & Authorization

- ✅ Registrazione utenti con password hashing (bcryptjs)
- ✅ Login con JWT token
- ✅ Middleware di autenticazione per proteggere route
- ✅ Role-based access control (admin/user)
- ✅ Validazione password robusta (min 8 caratteri, maiuscola, minuscola, numero)

### Gestione Prodotti

- ✅ CRUD completo prodotti (admin only)
- ✅ Ricerca prodotti per nome (case-insensitive regex)
- ✅ Filtering avanzato (prezzo, categoria, disponibilità)
- ✅ Sorting e pagination
- ✅ Upload e resize immagini prodotti
- ✅ Gestione stock automatica

### Sistema Recensioni

- ✅ CRUD recensioni autenticate
- ✅ Calcolo automatico rating medio prodotto
- ✅ Middleware post-save/delete per aggiornare statistiche
- ✅ Validazione: 1 recensione per utente per prodotto

### Carrello

- ✅ Gestione carrello personale per utente
- ✅ Aggiunta/rimozione prodotti
- ✅ Calcolo automatico totale carrello
- ✅ Populate prodotti con dettagli completi

### Ordini

- ✅ Creazione ordini dal carrello
- ✅ Gestione stati ordini (pending, processing, shipped, delivered, cancelled)
- ✅ Verifica e aggiornamento stock al checkout
- ✅ Validazione indirizzo spedizione con Zod
- ✅ Snapshot prezzi al momento dell'ordine

### Validazione Multi-Layer

- ✅ **Layer 1**: TypeScript (compile-time type checking)
- ✅ **Layer 2**: Zod (runtime API input validation)
- ✅ **Layer 3**: Mongoose (database schema validation)

### Error Handling

- ✅ Gestione centralizzata errori con classe AppError
- ✅ Async error wrapper (catchAsync) per eliminare try-catch ripetitivi
- ✅ Messaggi di errore user-friendly

---

## 🛠️ Setup e Installazione

### Prerequisiti

- Node.js >= 18.x
- MongoDB >= 6.x (locale o Atlas)
- npm o yarn

### Installazione

```bash
# 1. Clona il repository
git clone <repository-url>
cd progetto-cms/server

# 2. Installa dipendenze
npm install

# 3. Configura variabili d'ambiente
# Crea file .env nella cartella server/
```

### Variabili d'Ambiente (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/ecommerce
# Oppure MongoDB Atlas:
# DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/ecommerce

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=90d

# CORS (per frontend)
CLIENT_URL=http://localhost:5173
```

### Avvio Applicazione

```bash
# Development (con hot reload)
npm run dev

# Production build
npm run build
npm start
```

Il server sarà disponibile su `http://localhost:5000`

---

## 📚 API Endpoints

### Authentication

```
POST   /api/auth/register    # Registrazione nuovo utente
POST   /api/auth/login       # Login utente
```

### Products

```
GET    /api/products              # Lista prodotti (public)
GET    /api/products/:id          # Dettaglio prodotto (public)
POST   /api/products              # Crea prodotto (admin)
PATCH  /api/products/:id          # Aggiorna prodotto (admin)
DELETE /api/products/:id          # Elimina prodotto (admin)
```

**Query Parameters (GET /api/products):**

- `search`: ricerca per nome
- `category`: filtra per categoria
- `price[gte]`, `price[lte]`: filtra per prezzo
- `sort`: ordinamento (es: `price`, `-price`, `name`)
- `page`, `limit`: paginazione

### Reviews

```
GET    /api/products/:productId/reviews     # Lista recensioni prodotto
POST   /api/products/:productId/reviews     # Crea recensione (auth)
PATCH  /api/reviews/:id                     # Aggiorna recensione (auth, owner)
DELETE /api/reviews/:id                     # Elimina recensione (auth, owner)
```

### Cart

```
GET    /api/cart                  # Visualizza carrello (auth)
POST   /api/cart                  # Aggiungi prodotto (auth)
PATCH  /api/cart/:productId       # Aggiorna quantità (auth)
DELETE /api/cart/:productId       # Rimuovi prodotto (auth)
DELETE /api/cart                  # Svuota carrello (auth)
```

### Orders

```
GET    /api/orders                # Lista ordini (auth: user=propri, admin=tutti)
GET    /api/orders/:id            # Dettaglio ordine (auth, ownership check)
POST   /api/orders                # Crea ordine da carrello (auth)
PATCH  /api/orders/:id            # Aggiorna stato (admin)
```

---

## 🔐 Authentication

L'API usa **JWT Bearer tokens** per l'autenticazione.

### Ottenere un Token

```bash
# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}

# Response
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": { ... }
  }
}
```

### Usare il Token

Includi il token nell'header `Authorization` per le route protette:

```bash
GET /api/cart
Authorization: Bearer <your-token-here>
```

---

## ✅ Validazione Input (Zod)

Tutti gli endpoint che accettano dati utilizzano **Zod** per validazione runtime.

### Esempio: Registrazione

```json
POST /api/auth/register

{
  "name": "Mario Rossi",
  "email": "mario@example.com",
  "password": "Password123",
  "passwordConfirm": "Password123"
}
```

**Validazioni applicate:**

- `name`: min 3 caratteri
- `email`: formato email valido
- `password`: min 8 caratteri + almeno 1 maiuscola, 1 minuscola, 1 numero
- `passwordConfirm`: deve coincidere con password

**Errore di validazione (400):**

```json
{
  "status": "error",
  "message": "Dati di input non validi",
  "errors": [
    { "field": "email", "message": "inserisci un'email valida" },
    {
      "field": "password",
      "message": "La password deve contenere almeno 8 caratteri"
    }
  ]
}
```

---

## 🧪 Testing

### Test Manuali con Postman/Thunder Client

1. **Registra un utente**

   ```
   POST /api/auth/register
   Body: { name, email, password, passwordConfirm }
   ```

2. **Login e salva il token**

   ```
   POST /api/auth/login
   Body: { email, password }
   → Copia il token dalla risposta
   ```

3. **Testa endpoint autenticati**
   ```
   Aggiungi header:
   Authorization: Bearer <token>
   ```

### Test Scenari Comuni

**Scenario: Acquisto prodotto**

1. `GET /api/products` - Visualizza prodotti
2. `POST /api/cart` - Aggiungi prodotto al carrello
3. `GET /api/cart` - Verifica carrello
4. `POST /api/orders` - Crea ordine con indirizzo spedizione
5. `GET /api/orders` - Verifica ordine creato

---

## 🏗️ Architettura e Pattern

### Defense in Depth (Validazione Multi-Layer)

```
Input → Zod Validation → Controller → Mongoose Validation → Database
        ↓ (se invalido)              ↓ (se invalido)
        400 Error                     500 Error
```

1. **Zod**: Valida formato e tipi all'ingresso (API layer)
2. **Mongoose**: Valida business rules al salvataggio (DB layer)
3. **TypeScript**: Type checking durante sviluppo

### Error Handling Pattern

```typescript
// AppError custom class
class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
}

// catchAsync wrapper
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
```

### Middleware Chain Example

```typescript
router.post(
  "/products",
  authenticateToken, // 1. Verifica JWT
  restrictTo("admin"), // 2. Verifica ruolo admin
  upload.single("image"), // 3. Upload immagine
  resizeProductImage, // 4. Resize immagine
  validateMiddleware(schema), // 5. Valida input con Zod
  createProduct, // 6. Controller logic
);
```

---

## 📖 Mongoose Models

### User

- `name`, `email`, `password` (hashed), `role` (enum: user/admin)
- Metodi: password hashing pre-save

### Product

- `name`, `description`, `price`, `category`, `howManyAvailable`, `inStock`
- `ratingsAverage`, `ratingsQuantity` (calcolati da recensioni)
- Virtual: `reviews` (popolazione recensioni)

### Review

- `review`, `rating` (1-5), `product`, `user`
- Indice composto: un utente può fare 1 recensione per prodotto
- Middleware: aggiorna automaticamente rating prodotto

### Cart

- `user`, `items` (array di { product, quantity }), `totalPrice`
- Metodi: calcolo automatico totale

### Order

- `user`, `items`, `totalPrice`, `status`, `shippingAddress`
- Status: pending, processing, shipped, delivered, cancelled

---

## 🔒 Security Best Practices

- ✅ Password hashing con bcrypt (10 rounds)
- ✅ JWT con secret robusta
- ✅ Input validation (Zod) contro injection
- ✅ CORS configurato per frontend specifico
- ✅ Helmet.js per security headers
- ✅ Rate limiting (da implementare per produzione)

---

## 🚧 TODO - Sviluppo futuro

- [ ] Refresh tokens per JWT
- [ ] Verifica email (Nodemailer)
- [ ] Processo pass reset
- [ ] Integrazione pagamenti Stripe
- [ ] Analytics dashboard admin
- [ ] Unit tests (Jest)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Redis caching per performance
- [ ] Webhooks per order status changes

---

## 📝 Note per Sviluppatori

### Convenzioni Codice

- **Controllers**: Business logic, utilizzano catchAsync
- **Models**: Solo definizione schema e metodi relativi al model
- **Routes**: Solo definizione endpoint e middleware chain
- **Schemas**: Validazione Zod separata per riusabilità

### Naming Conventions

- Controllers: `<entity>Controller.ts` (es: `productController.ts`)
- Models: `<entity>Model.ts` (es: `productModel.ts`)
- Routes: `<entity>Routes.ts` (es: `productRoutes.ts`)
- Schemas: `<entity>Schema.ts` (es: `productSchema.ts`)

## 📄 License

Questo progetto è stato creato per scopi didattici e di portfolio.
