import { Router } from "express";
import { db } from "../..";
import { Author } from "../database/entities/author";
const router = Router();

let validStates = new Set<string>();

function generateState() {
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  validStates.add(state);
  return state;
}

export function generateOauthLink() {
  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.append("client_id", process.env.CLIENT_ID ?? "");
  url.searchParams.append("redirect_uri", process.env.REDIRECT_URI ?? "");
  url.searchParams.append("state", generateState());
  url.searchParams.append("response_type", "code");
  url.searchParams.append("scope", "identify");
  url.searchParams.append("prompt", "none");
  return url.toString();
}

router.get("/login", (req, res) => {
  res.redirect(generateOauthLink());
});

router.get("/callback", async (req, res) => {
  const code = req.query.code as string;
  const state = req.query.state as string;

  if (!code) {
    return res.status(400).json({
      error: "No code provided",
    });
  }

  if (!state) {
    return res.status(400).json({
      error: "No state provided",
    });
  }

  if (!validStates.has(state)) {
    return res.status(400).json({
      error: "Invalid state",
      warning: "This may be a CSRF attack.",
    });
  }

  validStates.delete(state);

  // exchange code for token

  const tokenExchangeResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID ?? "",
      client_secret: process.env.CLIENT_SECRET ?? "",
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.REDIRECT_URI ?? "",
    }),
  });

  if (!tokenExchangeResponse.ok) {
    return res.status(500).json({
      error: "Failed to exchange code for token",
    });
  }

  const tokenExchangeData: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
  } = await tokenExchangeResponse.json();

  // exchange token for user info

  const userInfoResponse = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${tokenExchangeData.token_type} ${tokenExchangeData.access_token}`,
    },
  });

  if (!userInfoResponse.ok) {
    return res.status(500).json({
      error: "Failed to get user info",
    });
  }

  const userInfoData = (await userInfoResponse.json()) as {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
  };

  let author = await db.em.findOne(Author, { id: userInfoData.id });
  if (!author) {
    author = db.em.create(Author, {
      id: userInfoData.id,
      name: userInfoData.username,
      avatar: userInfoData.avatar ?? "",
      createdAt: new Date()
    });
    await db.em.persistAndFlush(author);
  }



});

export default router;
