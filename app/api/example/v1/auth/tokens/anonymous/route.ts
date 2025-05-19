import jwt from "jsonwebtoken";

/**
 * 获取令牌
 * @returns jwt token and refresh token
 */
export async function POST() {
  try {
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

    // 生成新的刷新令牌
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30); // 30天后过期

    const response = {
      access_token: jwt.sign(accessTokenPayload, "your-secret-key"),
      refresh_token: {
        token: `refresh_${crypto.randomUUID().replace(/-/g, "")}`,
        expires_at: refreshTokenExpiry.toISOString(),
      },
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
