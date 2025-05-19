import jwt from "jsonwebtoken";

/**
 * 刷新令牌
 * @param refresh_token 刷新令牌
 * @example
 * {
 *   "refresh_token": "refresh_0jovoiwjd1hU3l24iy4iGIXu"
 * }
 * @returns jwt token and refresh token
 */
export async function POST(req: Request) {
  try {
    const { refresh_token } = await req.json();

    if (!refresh_token) {
      return new Response("Missing refresh token", { status: 400 });
    }

    // 生成访问令牌
    const now = Math.floor(Date.now() / 1000);
    const accessTokenPayload = {
      workspace_id: "",
      project_id: "",
      iat: now,
      nbf: now - 10, // 允许10秒的时钟偏差
      exp: now + 300, // 访问令牌5分钟后过期
      iss: "",
      sub: "",
    };

    const response = {
      access_token: jwt.sign(accessTokenPayload, "your-secret-key"),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to refresh token" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
