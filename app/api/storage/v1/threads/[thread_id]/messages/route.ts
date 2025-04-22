import { createClient } from "@/utils/supabase/server";

/**
 * 获取消息
 * @param thread_id 线程ID
 * @example
 * /v1/threads/thread_03MD9BixtUBRK13thC7t83uN/messages
 * @returns 消息列表
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ thread_id: string }> }
) {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { thread_id } = await params;
  if (!thread_id) {
    return new Response("Bad Request", { status: 400 });
  }

  const res = await supabase.rpc("get_messages_by_thread_and_user", {
    tid: thread_id,
    uid: data.user.id,
  });

  if (res.error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  return new Response(
    JSON.stringify(
      res.data || {
        messages: [],
      }
    ),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

/**
 * 创建消息
 * @param thread_id 线程ID
 * @example
 * /v1/threads/thread_03MD9BixtUBRK13thC7t83uN/messages
 * @param content 消息内容
 * @param format 消息格式
 * @param parent_id 父消息ID
 * @example
 * {
 *   "parent_id": "msg_0B22qcfrLaZGd9DW79RSu7zJ",
 *   "format": "aui/v0",
 *   "content": {
 *     "role": "user",
 *     "content": [
 *       {
 *         "type": "text",
 *         "text": "推荐几种做法"
 *       }
 *     ],
 *     "metadata": {
 *       "custom": {}
 *     }
 *   }
 * }
 * {
 *   "parent_id": "msg_0BSJLBu1xuprbS5NHXgYBbP7",
 *   "format": "aui/v0",
 *   "content": {
 *     "role": "assistant",
 *     "content": [
 *       {
 *         "type": "text",
 *              "text": "以下为你推荐几种常见又美味的面条做法：\n\n### 西红柿鸡蛋面\n- **食材准备**：面条、西红柿、鸡蛋、葱、盐、糖、生抽、食用油。\n- **做法步骤**\n    1. 鸡蛋打入碗中，搅拌均匀；西红柿洗净切块，葱切成葱花备用。\n    2. 锅中倒油，油热后倒入鸡蛋液，炒熟盛出。\n    3. 锅中再倒少许油，放入葱花爆香，加入西红柿块翻炒，炒出汤汁后加入适量盐、糖和生抽调味。\n    4. 倒入适量清水，大火煮开后放入面条，煮至面条熟透。\n    5. 最后将炒好的鸡蛋倒入锅中，搅拌均匀即可。\n\n### 红烧牛肉面\n- **食材准备**：面条、牛肉、洋葱、姜、蒜、八角、桂皮、香叶、盐、生抽、老抽、料酒、冰糖。\n- **做法步骤**\n    1. 牛肉切成小块，冷水下锅，加入料酒，焯水后捞出洗净。\n    2. 洋葱切块，姜、蒜切片备用。\n    3. 锅中倒油，放入洋葱、姜、蒜炒香，加入牛肉块翻炒均匀。\n    4. 加入生抽、老抽、料酒、冰糖、八角、桂皮、香叶，翻炒上色。\n    5. 加入适量清水，大火煮开后转小火炖煮1 - 2小时，直到牛肉软烂。\n    6. 另起锅烧水，水开后放入面条煮熟，捞出放入碗中。\n    7. 将煮好的牛肉和汤汁浇在面条上即可。\n\n### 凉拌面\n- **食材准备**：面条、黄瓜、胡萝卜、蒜、生抽、醋、盐、糖、辣椒油、香油。\n- **做法步骤**\n    1. 黄瓜、胡萝卜洗净切丝，蒜切末备用。\n    2. 锅中烧水，水开后放入面条煮熟，捞出过凉水，沥干水分后放入碗中。\n    3. 在碗中加入蒜末、生抽、醋、盐、糖、辣椒油、香油，搅拌均匀。\n    4. 放入黄瓜丝和胡萝卜丝，再次搅拌均匀即可。 "
 *          }
 *      ],
 *      "metadata": {
 *          "unstable_annotations": [],
 *          "unstable_data": [],
 *          "steps": [
 *              {
 *                  "state": "finished",
 *                  "messageId": "msg-ZWD7ZvQ3IiwWcBreiXcXQ8Pw",
 *                  "finishReason": "stop",
 *                  "usage": {
 *                      "promptTokens": null,
 *                      "completionTokens": null
 *                  },
 *                  "isContinued": false
 *              }
 *          ],
 *          "custom": {}
 *      },
 *      "status": {
 *          "type": "complete",
 *          "reason": "stop"
 *      }
 *  }
 * }
 * @returns 消息ID
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ thread_id: string }> }
) {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { thread_id } = await params;
  const { content, format, parent_id } = await req.json();
  if (!content || !format || parent_id === undefined || !thread_id) {
    return new Response("Bad Request", { status: 400 });
  }

  const res = await supabase.rpc("create_message", {
    c: content,
    fmt: format,
    pid: parent_id,
    tid: thread_id,
    uid: data.user.id,
  });

  if (res.error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  return new Response(JSON.stringify(res.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
