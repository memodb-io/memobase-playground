import service, { Res } from "../http";


export const sendFeedback = async (type: string, content: string): Promise<Res<null>> => {
  return await service.post("/api/feedback", { type, content });
};
