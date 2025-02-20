import { getAllMembers } from "./members.get";

export default eventHandler(async () => {
  const result = await getAllMembers("guest");
  return result;
});
