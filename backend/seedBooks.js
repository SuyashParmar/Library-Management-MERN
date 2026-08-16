require("dotenv").config();
const mongoose = require("mongoose");
const bookModel = require("./Models/book");

const seedBooks = [
  { title: "Dune", author: "Frank Herbert", category: "Sci-Fi", description: "Set on the desert planet Arrakis.", totalCopies: 10, availableCopies: 10, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg" },
  { title: "1984", author: "George Orwell", category: "Fiction", description: "A dystopian social science fiction novel.", totalCopies: 8, availableCopies: 8, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic", description: "A novel about the American Dream.", totalCopies: 5, availableCopies: 5, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg" },
  { title: "Clean Code", author: "Robert C. Martin", category: "Programming", description: "A Handbook of Agile Software Craftsmanship.", totalCopies: 12, availableCopies: 12, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg" },
  { title: "Sapiens", author: "Yuval Noah Harari", category: "History", description: "A Brief History of Humankind.", totalCopies: 7, availableCopies: 7, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg" },
  { title: "Atomic Habits", author: "James Clear", category: "Self-Help", description: "An Easy & Proven Way to Build Good Habits.", totalCopies: 15, availableCopies: 15, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg" },
  { title: "Neuromancer", author: "William Gibson", category: "Sci-Fi", description: "The defining cyberpunk novel.", totalCopies: 4, availableCopies: 4, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780441569595-L.jpg" },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", category: "Programming", description: "Your journey to mastery.", totalCopies: 6, availableCopies: 6, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780201616224-L.jpg" },
  { title: "To Kill a Mockingbird", author: "Harper Lee", category: "Classic", description: "Compassionate, dramatic, and deeply moving.", totalCopies: 9, availableCopies: 9, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780060935467-L.jpg" },
  { title: "The Catcher in the Rye", author: "J.D. Salinger", category: "Fiction", description: "The brilliant, funny, meaningful novel.", totalCopies: 6, availableCopies: 6, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg" },
  { title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fantasy", description: "A great modern classic.", totalCopies: 11, availableCopies: 11, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780345339683-L.jpg" },
  { title: "Pride and Prejudice", author: "Jane Austen", category: "Romance", description: "A classic of English literature.", totalCopies: 5, availableCopies: 5, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg" },
  { title: "Moby-Dick", author: "Herman Melville", category: "Classic", description: "The epic tale of Captain Ahab's quest.", totalCopies: 3, availableCopies: 3, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg" },
  { title: "Design Patterns", author: "Erich Gamma", category: "Programming", description: "Elements of Reusable Object-Oriented Software.", totalCopies: 8, availableCopies: 8, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Psychology", description: "The groundbreaking tour of the mind.", totalCopies: 7, availableCopies: 7, bookType: "physical", coverImage: "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg" }
];

mongoose.connect(process.env.MONGODB_URL).then(async () => {
  console.log("Connected to DB, seeding books...");
  await bookModel.deleteMany({}); // clear existing
  await bookModel.insertMany(seedBooks);
  console.log("Seeding complete!");
  process.exit(0);
}).catch(err => {
  console.error("DB connection error:", err);
  process.exit(1);
});
