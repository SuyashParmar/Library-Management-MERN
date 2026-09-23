const Groq = require("groq-sdk");
const bookModel = require("../Models/book");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chatBot = async (req, res) => {
  try {
    const { message, history } = req.body;

    // Fetch library context
    const books = await bookModel.find({}).select("title author category description availableCopies");
    const bookList = books.map(b => `- ${b.title} by ${b.author} [${b.category}] (${b.availableCopies} available)`).join("\n");

    const systemPrompt = `You are a helpful and polite smart library assistant. 
    You are chatting with a student. Keep your answers concise, friendly, and formatted nicely (use markdown, emojis, line breaks).
    
    Here is the live inventory of the library right now:
    ${bookList}

    Rules of the library:
    - Physical books can be requested, and an admin must approve them.
    - Digital books (PDFs) can be read immediately online.
    - If a book has 0 available copies, they cannot borrow it.

    Answer the user's question based on the inventory and rules above. If they ask about a book not in the list, tell them it's not available.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []),
      { role: "user", content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama3-70b-8192",
      temperature: 0.5,
    });

    res.json({ reply: chatCompletion.choices[0]?.message?.content || "I couldn't process that request." });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ reply: "I'm having trouble connecting to my brain right now! Please try again later." });
  }
};

const semanticSearch = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json({ ids: [] });

    const books = await bookModel.find({}).select("_id title author category description tags");
    
    // We send a stripped down version of the catalog to the LLM to save tokens
    const catalog = books.map(b => `ID:${b._id} | Title:${b.title} | Author:${b.author} | Desc:${b.description} | Tags:${b.tags.join(",")}`).join("\n");

    const systemPrompt = `You are a Semantic Search Engine for a library. 
    Given the user's query and the catalog below, return ONLY a JSON object containing an array of the matching book IDs that best fit the query semantically.
    Format exactly like this: { "ids": ["id1", "id2"] }
    Do not return any other text.

    CATALOG:
    ${catalog}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Search Query: "${query}"` }
      ],
      model: "llama3-70b-8192",
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(chatCompletion.choices[0]?.message?.content || '{"ids":[]}');
    res.json(result);
  } catch (error) {
    console.error("Semantic search error:", error);
    res.status(500).json({ ids: [] });
  }
};

module.exports = { chatBot, semanticSearch };
