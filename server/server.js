const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/quesRoutes");
const codeRoutes = require("./routes/codeRoutes");

const app = express();
const port = 5000;

// Connect to MongoDB
connection();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", questionRoutes);
app.use("/api/code", codeRoutes);

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const JUDGE0_API_KEY = "93abed8707mshb01feb0a6b7e11cp178c61jsn60e107e0db56"; 

const languageMap = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 84
};

// Execute Code Route
app.post("/api/code", async (req, res) => {
  const { language, code, testCases } = req.body;

  if (!languageMap[language]) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  try {
    const submissions = testCases.map((testCase) => ({
      source_code: Buffer.from(code).toString("base64"),
      language_id: languageMap[language],
      stdin: Buffer.from(testCase.input).toString("base64"),
      expected_output: Buffer.from(testCase.expectedOutput).toString("base64"),
    }));

    const submissionResponses = await Promise.all(
      submissions.map((submission) =>
        axios.post(`${JUDGE0_API_URL}?base64_encoded=true`, submission, {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": JUDGE0_API_KEY,
            "Content-Type": "application/json",
          },
        })
      )
    );

    const tokens = submissionResponses.map((res) => res.data.token);

    // Fetch Results
    const results = await Promise.all(
      tokens.map((token) =>
        axios.get(`${JUDGE0_API_URL}/${token}?base64_encoded=true`, {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": JUDGE0_API_KEY,
          },
        })
      )
    );

    const formattedResults = results.map((result, index) => ({
      input: testCases[index].input,
      expectedOutput: Buffer.from(testCases[index].expectedOutput, "base64").toString(),
      actualOutput: result.data.stdout ? Buffer.from(result.data.stdout, "base64").toString() : "Error",
      passed: result.data.stdout
        ? Buffer.from(result.data.stdout, "base64").toString().trim() ===
          Buffer.from(testCases[index].expectedOutput, "base64").toString().trim()
        : false,
    }));

    res.json({ results: formattedResults });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({ error: "Failed to execute code" });
  }
});



app.listen(port, () => console.log(`Server is running on port ${port}`));
