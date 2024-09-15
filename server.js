import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import { ObjectId } from "mongodb";

const URL =
  "mongodb+srv://obededintala:Z8r0mO85lpwx6QaW@users.jfnoc.mongodb.net/?retryWrites=true&w=majority&appName=Users";

const client = new MongoClient(URL);

const app = express();
app.use(express.json());
app.use(cors());

const dbName = "Users";
const collectionName = "User-informations";

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
}

connectToDatabase();

/*CRUD*/

//Create
app.post("/signup", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const { name, password } = req.body;

    // Verifica se o usuário já existe no banco de dados
    const existentUser = await collection.findOne({ name });

    if (existentUser) {
      // Se o usuário existe e a senha está correta, faz login
      if (existentUser.password === password) {
        return res.status(200).json({ message: "Login bem-sucedido", user: existentUser });
      } else {
        return res.status(400).json({ error: "Senha incorreta" });
      }
    }

    // Se o usuário não existir, cria uma nova conta
    const result = await collection.insertOne({ name, password });
    return res.status(201).json({ message: "Conta criada com sucesso", id: result.insertedId });

  } catch (error) {
    console.error("Erro ao verificar/criar usuário:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/*Read*/

app.get("/signup", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const users = await collection.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* Deletar Usuário */
app.delete("/signup/:id", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Usuario excluido" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* Deletar Todos os Usuários */
app.delete("/signup", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Remove todos os documentos na coleção
    const result = await collection.deleteMany({});

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "No users found to delete" });
    }

    res.status(200).json({ message: "Todos os usuários foram excluídos" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
