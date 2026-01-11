# ReviewFilms — Beginner-Friendly System Guide

This document explains **how the ReviewFilms app works**, in plain language.

The app is made of two halves that talk to each other:

1. **Backend (server)**: the "brain + storage". It saves movies/reviews and calculates ratings.
2. **Frontend (website)**: the "face". It shows screens and sends requests to the backend.

When you present: think of it like a restaurant:
- **Frontend** = the menu + waiter (what you see, where you click)
- **Backend** = the kitchen (does the work)
- **Database** = the fridge + recipe book (stores information)
- **API** = the order system (how frontend asks backend for things)

---

## What folders matter most

### `backend/`
This is the server side.
- It contains the API endpoints (request/response for movies and reviews)
- It connects to the SQLite database file
- It has Swagger documentation (interactive API testing)

### `frontend/`
This is the website.
- It shows the movie list, movie details, and review forms
- It talks to the backend using **HTTP requests** (Axios library)
- No real-time features needed (it's not a chat app)

---

## The big picture flow (most important)

### Flow A — Viewing Movies (the main screen)
1. User opens the website at http://localhost:5173
2. The website asks the backend: "Give me all movies"
   - `GET /movies`
3. The backend reads from the database and returns all movies + their reviews
4. The website displays each movie in a card showing:
   - Title, genre, year
   - Average rating (calculated from all reviews)
   - Number of reviews
   - Buttons (View Details, Delete)

**Beginner translation:**
It's like opening a menu at a restaurant — the waiter (frontend) asks the kitchen (backend) "what's available?" and displays it nicely.

---

### Flow B — Adding a Movie (create new data)
1. User clicks "Add Movie" button
2. A popup form appears
3. User fills in:
   - Title
   - Genre
   - Release Year
   - Description
4. User clicks "Submit"
5. The website sends the data to the backend:
   - `POST /movies` with the movie information
6. The backend:
   - Validates the data (checks nothing is empty)
   - Saves it to the database
   - Returns the new movie
7. The website refreshes the list automatically

**Beginner translation:**
It's like telling the waiter "add this new dish to the menu" — they take it to the kitchen, kitchen updates their recipe book.

---

### Flow C — Writing a Review (the rating system)
1. User clicks "View Details" on a movie
2. The website loads:
   - Movie information: `GET /movies/:id`
   - All reviews for that movie: `GET /reviews/movie/:movieId`
3. User sees the movie details and existing reviews
4. User clicks "Add Review"
5. User fills in:
   - Their name
   - Star rating (1-5 stars, click to select)
   - Review comment
6. User clicks "Submit Review"
7. The website sends:
   - `POST /reviews` with username, rating, comment, movieId
8. The backend:
   - Saves the review to the database
   - Links it to the movie (using movieId)
9. The website refreshes to show the new review
10. The average rating updates automatically

**Beginner translation:**
It's like writing a Yelp review — you rate it with stars, write your thoughts, and it gets added to the restaurant's page.

---

### Flow D — Rating Calculation (the math)
**This happens automatically when you view a movie.**

How the backend calculates average rating:
1. Gets all reviews for a movie
2. Adds up all the star ratings (e.g., 5 + 4 + 3 = 12)
3. Divides by the number of reviews (12 ÷ 3 = 4.0)
4. Rounds to 1 decimal place

Example:
- Review 1: ⭐⭐⭐⭐⭐ (5 stars)
- Review 2: ⭐⭐⭐⭐ (4 stars)
- Review 3: ⭐⭐⭐ (3 stars)
- **Average: 4.0 stars**

The frontend then shows this as filled/unfilled stars visually.

---

## Backend: purpose of the key files (server)

### `backend/src/main.ts`
**What it is:** the server's start button.

**What it does:**
- Creates the backend application
- Turns on validation (helps reject bad input)
- Turns on CORS (lets the frontend talk to it from a different port)
- Generates Swagger docs at `/api`
- Starts listening on port 3000

**Important code:**
```typescript
app.enableCors();
```
This line is **critical**. Without it:
- Frontend (port 5173) can't talk to backend (port 3000)
- Browser blocks requests (security protection)
- App won't work

**Beginner translation:**
CORS is like a bouncer at a club. By default, the bouncer says "you're from a different address, go away." `enableCors()` tells the bouncer "actually, let them in."

---

### `backend/src/app.module.ts`
**What it is:** the backend's "wiring hub".

**What it does:**
- Connects the database (SQLite file named `database.sqlite`)
- Registers all feature modules:
  - Movies
  - Reviews
- Tells TypeORM to create tables automatically (`synchronize: true`)

**Important syntax idea (plain English):**
This file is where NestJS is told: "these are the parts of my app, please load them."

---

### `backend/src/entities/*.entity.ts` (data blueprints)
These files describe what gets stored in the database.

Think: **Entity = a spreadsheet template** for the database.

#### `movie.entity.ts`
Stores movies.
- `id`: unique movie number (auto-generated)
- `title`: movie name (e.g., "The Matrix")
- `description`: movie summary
- `genre`: category (e.g., "Sci-Fi")
- `releaseYear`: year it came out (e.g., 1999)
- `createdAt`: when added to database
- `reviews`: connection to all reviews for this movie

**Important line:**
```typescript
@OneToMany(() => Review, (review) => review.movie, { cascade: true, onDelete: 'CASCADE' })
```

**Beginner translation:**
"One movie can have many reviews. If I delete the movie, delete all its reviews too."

#### `review.entity.ts`
Stores reviews.
- `id`: unique review number
- `movieId`: which movie this is for (links to movie)
- `userName`: who wrote it (just a text field, no login required)
- `comment`: the review text
- `rating`: stars (1-5, stored as a number)
- `createdAt`: when written

**Important line:**
```typescript
@ManyToOne(() => Movie, (movie) => movie.reviews, { onDelete: 'CASCADE' })
```

**Beginner translation:**
"Many reviews belong to one movie. If the movie gets deleted, this review gets deleted too."

---

### `backend/src/movies/*` (movie API)
These files handle all movie operations.

#### `movies.controller.ts`
**What it is:** where the URL routes live.

Examples:
- `POST /movies` — create a new movie
- `GET /movies` — get all movies
- `GET /movies/:id` — get one specific movie
- `GET /movies/:id/rating` — get average rating for a movie
- `PATCH /movies/:id` — update a movie
- `DELETE /movies/:id` — delete a movie

**Important syntax:**
```typescript
@Get(':id/rating')
async getAverageRating(@Param('id', ParseIntPipe) id: number)
```

**Beginner translation:**
"When someone visits `/movies/5/rating`, run this function with id=5."

#### `movies.service.ts`
**What it is:** the "business logic" for movies.

What it does:
- `create()`: saves a new movie to the database
- `findAll()`: gets all movies with their reviews (sorted newest first)
- `findOne(id)`: gets a specific movie by ID
- `update(id, data)`: changes movie information
- `remove(id)`: deletes a movie
- `getAverageRating(id)`: calculates the average stars

**Important logic (rating calculation):**
```typescript
async getAverageRating(id: number): Promise<number> {
  const movie = await this.findOne(id);
  if (!movie.reviews || movie.reviews.length === 0) {
    return 0;  // No reviews = 0 rating
  }
  const sum = movie.reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / movie.reviews.length) * 10) / 10;
}
```

**Beginner translation:**
"Add up all the ratings, divide by how many there are, round to 1 decimal."

---

### `backend/src/reviews/*` (review API)
These files handle all review operations.

#### `reviews.controller.ts`
**What it is:** where the URL routes live.

Examples:
- `POST /reviews` — create a new review
- `GET /reviews` — get all reviews
- `GET /reviews/movie/:movieId` — get reviews for a specific movie
- `DELETE /reviews/:id` — delete a review

#### `reviews.service.ts`
**What it is:** the "business logic" for reviews.

What it does:
- `create()`: saves a new review
- `findAll()`: gets all reviews (sorted newest first)
- `findByMovie(movieId)`: gets reviews for one movie
- `remove(id)`: deletes a review

**Important pattern:**
Controller says "someone wants to do this" → Service does the actual work → Database stores/retrieves data.

---

### `backend/src/movies/dto/*.dto.ts` and `backend/src/reviews/dto/*.dto.ts`
**What DTOs are:** Data Transfer Objects = rules for what data is allowed.

Example from `create-movie.dto.ts`:
```typescript
export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
  
  // ... etc
}
```

**Beginner translation:**
"When someone tries to create a movie, their data must have a title (can't be empty, must be text). If they send bad data, reject it automatically."

This is **validation** — it prevents saving garbage to the database.

---

## Frontend: purpose of the key files (website)

### `frontend/src/main.jsx`
**What it is:** the website start point.

It loads your main React component (`App.jsx`) into the page.

---

### `frontend/src/App.jsx`
**What it is:** the main screen container.

What it does:
- Shows the header ("ReviewFilms")
- Decides what to show:
  - If no movie selected → show `MovieList`
  - If movie selected → show `MovieDetails`
- Shows `AddMovieForm` popup when needed
- Manages "state" (what's currently happening)

**Important React concept:**
```javascript
const [selectedMovieId, setSelectedMovieId] = useState(null);
```

**Beginner translation:**
`selectedMovieId` is the app's memory of "which movie are we looking at?"
- `null` = we're on the main list
- `5` = we're viewing movie #5

When you call `setSelectedMovieId(5)`, React automatically updates the screen.

---

### `frontend/src/components/MovieList.jsx`
**What it is:** the grid of all movies.

What it does when it loads:
1. Asks backend for all movies (`GET /movies`)
2. Receives the data
3. For each movie:
   - Calculates average rating from its reviews
   - Displays movie card with stars
4. Shows "Add Movie" button
5. Shows "View Details" and "Delete" buttons for each movie

**Important function:**
```javascript
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};
```

**Beginner translation:**
This does the same math as the backend — add ratings, divide, round. Frontend calculates it for display purposes.

---

### `frontend/src/components/MovieDetails.jsx`
**What it is:** the detailed view of one movie + all its reviews.

What it does when you open it:
1. Fetches movie info: `GET /movies/:id`
2. Fetches reviews: `GET /reviews/movie/:movieId`
3. Displays:
   - Movie title, genre, year, description
   - Average rating with stars
   - "Add Review" button
   - List of all reviews
4. If you click "Add Review":
   - Shows a form
   - Has star selector (click stars to rate)
   - Has text box for comment
   - Has name field
5. When you submit:
   - Sends `POST /reviews`
   - Refreshes the page data

**Important interaction:**
```javascript
const [reviewForm, setReviewForm] = useState({
  userName: '',
  comment: '',
  rating: 5,
});
```

**Beginner translation:**
This is the form's memory. As you type your name or click stars, it updates this memory. When you click Submit, it sends this data to the backend.

---

### `frontend/src/components/AddMovieForm.jsx`
**What it is:** the popup form for adding movies.

What it does:
- Shows input fields (title, genre, year, description)
- Validates input (checks fields aren't empty)
- On submit:
  - Sends `POST /movies` with the data
  - Closes the popup
  - Tells parent component to refresh the list

**Important detail:**
```javascript
onClick={(e) => e.stopPropagation()}
```

**Beginner translation:**
The popup has a dark background. Clicking the background closes the popup. But clicking inside the form should NOT close it. This line prevents that.

---

### `frontend/src/services/api.js`
**What it is:** the "phone book" for talking to the backend.

It contains functions like:
- `getMovies()` → calls `GET /movies`
- `createMovie(data)` → calls `POST /movies`
- `getMovieReviews(movieId)` → calls `GET /reviews/movie/:movieId`
- `createReview(data)` → calls `POST /reviews`

**Important setup:**
```javascript
const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Beginner translation:**
This sets up Axios (the HTTP library) to always talk to `http://localhost:3000` and send JSON format data.

**Usage example:**
```javascript
import { getMovies } from '../services/api';

const response = await getMovies();
const movies = response.data;  // The actual movie array
```

---

## Common "important syntax" explained simply

### 1) NestJS decorators (labels above code)
In the backend, you'll see labels like:
- `@Controller('movies')` — "this handles URLs starting with `/movies`"
- `@Get()` — "this function runs for GET requests"
- `@Post()` — "this function runs for POST requests"
- `@Param('id')` — "grab the ID from the URL"
- `@Body()` — "grab the data from the request body"

**Beginner translation:**
These are sticky notes that tell NestJS what each function does.

---

### 2) TypeORM decorators (database blueprints)
You'll see:
- `@Entity('movies')` — "this class represents the movies table"
- `@PrimaryGeneratedColumn()` — "this is the ID, auto-increment it"
- `@Column()` — "this is a column in the table"
- `@OneToMany(...)` — "one movie has many reviews"
- `@ManyToOne(...)` — "many reviews belong to one movie"

**Beginner translation:**
These tell TypeORM how to structure the database and how tables connect.

---

### 3) React state (`useState`) = memory for the screen
In the frontend you'll see:
```javascript
const [movies, setMovies] = useState([]);
```

**Beginner translation:**
- `movies` = current list of movies (starts as empty array `[]`)
- `setMovies([...])` = update it with new data, and React refreshes the screen automatically

---

### 4) React effects (`useEffect`) = "run this when something changes"
You'll see:
```javascript
useEffect(() => {
  fetchMovies();
}, []);
```

**Beginner translation:**
"When the component first loads (empty `[]` means 'once'), run `fetchMovies()`."

Another example:
```javascript
useEffect(() => {
  fetchMovieDetails();
}, [movieId]);
```

**Beginner translation:**
"Whenever `movieId` changes, fetch the movie details again."

---

### 5) Async/Await (waiting for backend responses)
You'll see:
```javascript
const fetchMovies = async () => {
  try {
    const response = await getMovies();
    setMovies(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

**Beginner translation:**
- `async` = "this function does something that takes time"
- `await` = "wait for this to finish before continuing"
- `try/catch` = "try this, but if it fails, handle the error"

It's like saying: "Wait for the kitchen to prepare the food. If they're out of ingredients, tell the customer there's an error."

---

## Key differences from Activity 8 (Hive Chat)

| Feature | Activity 6 (ReviewFilms) | Activity 8 (Hive) |
|---------|-------------------------|-------------------|
| **Real-time updates** | ❌ No (just HTTP requests) | ✅ Yes (WebSocket) |
| **Authentication** | ❌ No login system | ✅ JWT tokens |
| **User accounts** | ❌ No (just type a name) | ✅ Yes (signup/login) |
| **Main feature** | CRUD + rating calculation | Real-time chat |
| **Data relationships** | Movies → Reviews (one-to-many) | Rooms → Messages (one-to-many) |
| **Complexity** | Simpler | More complex |

---

## Security details

### CORS (Cross-Origin Resource Sharing)
**What it is:** Browser security that blocks websites from different origins talking to each other.

**The problem:**
- Frontend runs on `http://localhost:5173` (origin A)
- Backend runs on `http://localhost:3000` (origin B)
- Browser says: "These are different! Block the request!"

**The solution:**
```typescript
app.enableCors();
```

**What this does:**
Tells the backend: "Accept requests from any origin."

**Real-world analogy:**
- Without CORS: A hotel that only lets registered guests use the pool
- With `enableCors()`: The hotel says "actually, anyone can use the pool"

**Important note:**
In production, you'd restrict this:
```typescript
app.enableCors({
  origin: 'https://yourwebsite.com',  // Only allow your actual website
});
```

But for development on localhost, wide-open CORS is fine.

---

### Why no JWT tokens?
This app has **no authentication system** because:
- It's a learning project focused on CRUD operations
- Anyone can add/delete movies and reviews
- When you write a review, you just type your name (no verification)

**What would JWT add?**
If we added authentication:
1. Users would signup/login
2. Backend gives them a token (like a session pass)
3. Every request includes the token
4. Only logged-in users can write reviews
5. Users can only delete their own reviews

**Why Activity 6 doesn't need it:**
The focus is on:
- Database relationships (movies ↔ reviews)
- CRUD operations
- Rating calculations
- Not on security/user management

---

## Database structure (simplified)

Think of the database as two Excel spreadsheets:

### Sheet 1: movies
| id | title | genre | releaseYear | description | createdAt |
|----|-------|-------|-------------|-------------|-----------|
| 1 | The Matrix | Sci-Fi | 1999 | A hacker discovers reality is a simulation | 2026-01-10 |
| 2 | Inception | Thriller | 2010 | Dreams within dreams | 2026-01-10 |

### Sheet 2: reviews
| id | movieId | userName | rating | comment | createdAt |
|----|---------|----------|--------|---------|-----------|
| 1 | 1 | Alice | 5 | Mind-blowing! | 2026-01-10 |
| 2 | 1 | Bob | 4 | Great action | 2026-01-10 |
| 3 | 2 | Alice | 5 | Love it! | 2026-01-10 |

**The connection:**
- Review #1 and #2 both have `movieId = 1`, so they belong to "The Matrix"
- If you delete movie #1, reviews #1 and #2 automatically delete (cascade)

**Average rating for The Matrix:**
- Reviews: 5 and 4
- Sum: 9
- Count: 2
- Average: 9 ÷ 2 = 4.5 stars

---

## Validation explained

### Backend validation
Uses `class-validator` decorators:

```typescript
export class CreateMovieDto {
  @IsNotEmpty()  // Can't be empty
  @IsString()    // Must be text
  title: string;

  @IsInt()       // Must be a whole number
  @Min(1888)     // Can't be before movies existed
  @Max(2100)     // Reasonable future limit
  releaseYear: number;
}
```

**What happens:**
If someone tries to create a movie with `releaseYear: "hello"` (text instead of number), the backend automatically rejects it and sends an error.

### Frontend validation
Uses HTML5 validation:

```jsx
<input
  type="text"
  required           // Can't be empty
  placeholder="Enter film title"
/>

<input
  type="number"
  required
  min="1888"        // Browser enforces minimum
  max="2100"        // Browser enforces maximum
/>
```

**Beginner translation:**
Double validation (frontend + backend) ensures bad data never reaches the database.

---

## Quick mental model for your presentation

If someone asks "how does it work?" you can say:

### Simple version (30 seconds):
1. **Frontend shows movies** → asks backend for data
2. **Backend queries database** → returns movies + reviews
3. **Frontend displays** → shows cards with ratings
4. **User adds review** → frontend sends to backend → backend saves to database
5. **Rating updates** → backend calculates average → frontend shows stars

### Detailed version (2 minutes):
1. **User opens website** → frontend loads, asks backend `GET /movies`
2. **Backend fetches** → gets all movies with their reviews from SQLite database
3. **Frontend calculates** → for each movie, calculates average rating from reviews
4. **User clicks "View Details"** → frontend requests that specific movie's data
5. **User writes review** → fills form, clicks submit → `POST /reviews` → backend validates and saves
6. **Page refreshes** → shows new review, average rating updates automatically
7. **Delete operations** → when you delete a movie, cascade delete removes all its reviews

### Technical version (for instructors):
- **Architecture**: RESTful API with NestJS backend + React frontend
- **Database**: SQLite with TypeORM (one-to-many relationship: movies → reviews)
- **Communication**: HTTP requests via Axios (no WebSocket, not real-time)
- **Validation**: DTO classes with decorators (backend) + HTML5 validation (frontend)
- **CORS**: Enabled for cross-origin requests (localhost:5173 ↔ localhost:3000)
- **Rating system**: Server-side and client-side calculation of averages
- **No auth**: Open system, no JWT tokens or user sessions

---

## Common questions answered

### Q: Why do both frontend and backend calculate ratings?
**A:** 
- **Backend** calculates when you specifically ask for it (`GET /movies/:id/rating`)
- **Frontend** calculates for display purposes when showing the movie list (already has the review data, so why make another request?)

Both use the same math, just in different places.

---

### Q: What happens if I delete a movie?
**A:**
1. Frontend sends `DELETE /movies/:id`
2. Backend finds the movie
3. Because of `{ cascade: true, onDelete: 'CASCADE' }`, all reviews for that movie automatically delete
4. Movie is removed from database
5. Frontend refreshes, movie disappears from list

---

### Q: Can multiple people use this at the same time?
**A:** 
Yes, but with limitations:
- Multiple people can view movies at the same time
- They can add reviews simultaneously
- BUT: Changes don't appear in real-time for others
- Each person needs to refresh their browser to see new data
- (Unlike Activity 8 which uses WebSocket for instant updates)

---

### Q: Where is the data stored?
**A:**
In a file called `database.sqlite` in the `backend/` folder.

It's like a binary Excel file that contains both tables (movies and reviews). If you delete this file, all data is lost. If you copy this file to another computer, you copy all the data.

---

### Q: Why no password storage?
**A:**
This project focuses on CRUD operations and data relationships, not security. Adding authentication would require:
- User entity
- Password hashing (bcrypt)
- JWT tokens
- Auth guards
- Login/signup forms
- Protected routes

That's what Activity 8 covers. Activity 6 keeps it simple.

---

## Files you can skip (for beginners)

If you're presenting and want to focus on the essentials, you can skip explaining:
- `*.css` files (just styling, not logic)
- `nest-cli.json` (NestJS configuration)
- `tsconfig.json` (TypeScript configuration)
- `package.json` (dependency list)
- `vite.config.js` (build tool settings)
- `update-movie.dto.ts` (similar to create, just allows partial updates)

Focus on:
- `main.ts` (server start + CORS)
- Entities (database structure)
- Controllers (routes/URLs)
- Services (business logic)
- React components (UI)
- `api.js` (how frontend talks to backend)

---

## Final summary

**Activity 6 is a movie review system that demonstrates:**

1. ✅ **Full-stack development**: Separate backend (NestJS) and frontend (React)
2. ✅ **RESTful API**: Standard HTTP requests for CRUD operations
3. ✅ **Database relationships**: One movie has many reviews (one-to-many)
4. ✅ **Automatic calculations**: Average ratings computed from review data
5. ✅ **Data validation**: Both frontend and backend check for valid input
6. ✅ **CORS**: Enables cross-origin communication
7. ❌ **No real-time**: Uses standard HTTP, not WebSocket
8. ❌ **No authentication**: Open system, no user accounts or JWT

**Think of it as:**
A simple, but complete, movie rating website — like a mini IMDB where anyone can add movies and reviews, and the system automatically calculates and displays average ratings.

