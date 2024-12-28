export default async function handler(req, res) {
  if (req.method === "GET") {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Authorization code missing" });
    }

    try {
      // Google’dan access token olish
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: "http://localhost:3000/api/auth/callback",
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenData.access_token) {
        return res.status(400).json({ error: "Failed to fetch access token" });
      }

      // Foydalanuvchi ma’lumotlarini olish
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        }
      );

      const userData = await userResponse.json();

      // Keyinchalik foydalanuvchini sessiyada yoki cookie orqali boshqarishingiz mumkin
      res.status(200).json({ user: userData });
    } catch (error) {
      console.error("Error during Google callback:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
