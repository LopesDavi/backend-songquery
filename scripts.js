const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
//Posso aceitar origem cruzada de qualquer lugar
app.use(cors({ origin: true }));

//------------------------PEGANDO ACESS_TOKEN------------------------

//Pegar o access_token (Através do client_id + client_secret)
app.post("/access-token", async (req, res) => {
  try {
    //Enviando minhas credenciais de cliente (Criadas no Spotify)
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          //Juntando client_id + client_secret para autorização
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.SPOTIFY_CLIENT_ID +
                ":" +
                process.env.SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
        },
      }
    );
    //Descontruindo o objeto e pegando o access_token
    const { access_token } = response.data;
    res.json({ access_token });
  } catch (error) {
    //Pegando algum erro, caso haja algum
    console.error("Erro ao obter access_token", error);
    res.status(500).json({ error: "Erro ao obter access_token" });
  } finally {
  //Finalizando promise -> (Independente de sucesso ou erro)
  console.log("Promise (/access-token) -> Finalizada!");
  }
});

//------------------------PEGANDO TRACK, ALBUM, ARTIST PELO (ID)------------------------

//Pegar música pelo -> (id)
app.get("/get-track/:id", async (req, res) => {
  //Requisitando o id da música passado como parâmetro
  const idTrack = req.params.id;

  try {
    //Pegando o access_token -> (Credenciais client_id e client_secret no .env)
    const {
      data: { access_token },
    } = await axios.post(`${process.env.BASE_URL}/access-token`, {});

    //Pegando música através ID requisitado no parâmetro
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${idTrack}`,
      {
        //Header requisitado pela API do Spotify
        headers: { Authorization: "Bearer " + access_token },
      }
    );

    //Pegando resposes vindas da API
    const track = response.data;
    res.json(track);
  } catch (error) {
    //Pegando erro, caso haja algum
    console.error("Erro ao obter informações da faixa:", error.message);
    res.status(500).json({ error: "Erro ao obter informações da faixa" });
  } finally {
    //Finalizando promise -> (Independente de sucesso ou erro)
    console.log("Busca finalizada!");
  }
});

//Pegar álbum pelo -> (id)
app.get("/get-album/:id", async (req, res) => {
  //Requisitando o id do álbum passado como parâmetro
  const idAlbum = req.params.id;

  try {
    const {
      //Pegando o access_token -> (Credenciais client_id e client_secret no .env)
      data: { access_token },
    } = await axios.post(`${process.env.BASE_URL}/access-token`, {});

    //Pegando álbum através ID requisitado no parâmetro
    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${idAlbum}`,
      {
        //Header requisitado pela API do Spotify
        headers: { Authorization: "Bearer " + access_token },
      }
    );

    //Pegando resposes vindas da API
    const album = response.data;
    res.json(album);
  } catch (error) {
    //Pegando erro, caso haja algum
    console.error("Erro ao obter informações do álbum:", error.message);
    res.status(500).json({ error: "Erro ao obter informações do álbum" });
  } finally {
    //Finalizando promise -> (Independente de sucesso ou erro)
    console.log("Busca finalizada!");
  }
});

//Pegar artista pelo -> (id)
app.get("/get-artist/:id", async (req, res) => {
  //Requisitando o id do artista passado como parâmetro
  const idArtist = req.params.id;

  try {
    //Pegando o access_token -> (Credenciais client_id e client_secret no .env)
    const {
      data: { access_token },
    } = await axios.post(`${process.env.BASE_URL}/access-token`, {});

    //Pegando artista através ID requisitado no parâmetro
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${idArtist}`,
      {
        //Header requisitado pela API do Spotify
        headers: { Authorization: "Bearer " + access_token },
      }
    );

    //Pegando resposes vindas da API
    const artist = response.data;
    res.json(artist);
  } catch (error) {
    //Pegando erro, caso haja algum
    console.error("Erro ao obter informações do artista:", error.message);
    res.status(500).json({ error: "Erro ao obter informações do artista" });
  } finally {
    //Finalizando promise -> (Independente de sucesso ou erro)
    console.log("Busca finalizada!");
  }
});

//------------------------PEGANDO TRACK, ALBUM, ARTIST PELO (NAME)------------------------

//Pegar música específica pelo -> (nome)
app.get("/get-track", async (req, res) => {
  //Requisitando a query passada
  //A 'q'(query) é um parâmetro obrigatório para fazer busca de uma música específica (required pela API do Spotify)
  const { q } = req.query;
  try {
    const {
      //Pegando o access_token -> (Credenciais client_id e client_secret no .env)
      data: { access_token },
    } = await axios.post(`${process.env.BASE_URL}/access-token`, {});

    //Pegando a música pelo nome (?q=), passando o type da busca (track) e o limite de respostas vindas da API (limit)
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        q
      )}&type=track&limit=1`,
      {
        //Header requisitado pela API do Spotify
        headers: { Authorization: "Bearer " + access_token },
      }
    );

    //Pegando resposes vindas da API
    const artist = response.data;
    res.status(200).json(artist);
  } catch (error) {
    //Pegando erro, caso haja algum
    console.error(
      "Erro ao obter informações da música especificada:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Erro ao obter informações da música especificada" });
  } //finally {
  //   //Finalizando promise -> (Independente de sucesso ou erro)
  //   console.log("Busca finalizada!");
  // }
});

//Pegar álbum específico pelo -> (nome)
app.get("/get-album", async (req, res) => {
  //Requisitando a query passada
  //A 'q'(query) é um parâmetro obrigatório para fazer busca de um álbum específico (required pela API do Spotify)
  const { q } = req.query;
  try {
    const {
      //Pegando o access_token -> (Credenciais client_id e client_secret no .env)
      data: { access_token },
    } = await axios.post(`${process.env.BASE_URL}/access-token`, {});

    //Pegando o álbum pelo nome (?q=), passando o type da busca (album) e o limite de respostas vindas da API (limit)
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        q
      )}&type=album&limit=1`,
      {
        //Header requisitado pela API do Spotify
        headers: { Authorization: "Bearer " + access_token },
      }
    );

    //Pegando resposes vindas da API
    const artist = response.data;
    res.json(artist);
  } catch (error) {
    //Pegando erro, caso haja algum
    console.error(
      "Erro ao obter informações do álbum especificado:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Erro ao obter informações do álbum especificado" });
  } finally {
    //Finalizando promise -> (Independente de sucesso ou erro)
    console.log("Busca finalizada!");
  }
});

//Pegar artista específico pelo -> (nome)
app.get("/get-artist", async (req, res) => {
  //Requisitando a query passada
  //A 'q'(query) é um parâmetro obrigatório para fazer busca de um artista específico (required pela API do Spotify)
  const { q } = req.query;
  try {
    //Pegando o access_token -> (Credenciais client_id e client_secret no .env)
    const {
      data: { access_token },
    } = await axios.post(`${process.env.BASE_URL}/access-token`, {});

    //Pegando o artista pelo nome (?q=), passando o type da busca (artist) e o limite de respostas vindas da API (limit)
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        q
      )}&type=artist&limit=1`,
      {
        //Header requisitado pela API do Spotify
        headers: { Authorization: "Bearer " + access_token },
      }
    );

    //Pegando resposes vindas da API
    const artist = response.data;
    res.json(artist);
  } catch (error) {
    //Pegando erro, caso haja algum
    console.error(
      "Erro ao obter informações do artista especificado:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Erro ao obter informações do artista especificado" });
  } finally {
    //Finalizando promise -> (Independente de sucesso ou erro)
    console.log("Busca finalizada!");
  }
});

//Executando o servidor na porta (port) 3000
app.listen(port, () => {
  console.log(`Servidor iniciado em -> http://localhost:${port}`);
});
